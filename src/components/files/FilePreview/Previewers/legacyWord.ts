import BufferReader from 'word-extractor/lib/buffer-reader';
import type OleCompoundDoc from 'word-extractor/lib/ole-compound-doc';
import WordOleExtractor from 'word-extractor/lib/word-ole-extractor';

/** A table cell is a list of paragraphs. */
export type LegacyWordCell = string[];

export type LegacyWordBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'table'; rows: LegacyWordCell[][] };

export interface LegacyWordDocument {
  /** Blocks grouped by the page breaks the author inserted. */
  pages: LegacyWordBlock[][];
  header: string;
  footer: string;
  /** Footnotes and endnotes, which the body only references. */
  notes: string;
}

/**
 * Reads the text of a Word 97–2003 (.doc) file.
 *
 * Browsers have no renderer for the binary format, so this is text only:
 * paragraphs, tables and page breaks survive; fonts, images and lists do not.
 */
export const parseLegacyWord = async (
  data: ArrayBuffer
): Promise<LegacyWordDocument> => {
  const extractor = new WordOleExtractor();
  // `extract` fetches each OLE stream through these two methods. The library's
  // own versions go through Node's `stream` module; reading the sector chain
  // directly avoids that polyfill in the browser. See `readStream` for the
  // other browser difference this works around. The streams are kept, since
  // `markOverflowRowEnds` reads two of them again.
  let container: OleCompoundDoc | undefined;
  const streams: Partial<Record<'wordDocument' | 'table', Buffer>> = {};
  extractor.documentStream = async (document, streamName) => {
    container = document;
    const buffer = await readStream(document, streamName);
    // `extract` only ever asks for 'WordDocument' and '0Table' or '1Table'
    streams[streamName === 'WordDocument' ? 'wordDocument' : 'table'] = buffer;
    return buffer;
  };
  extractor.streamBuffer = async (buffer) => buffer as Buffer;
  const document = await extractor.extract(new BufferReader(Buffer.from(data)));
  // The library's getters fold cell and row marks into tabs and newlines,
  // which makes tables unrecoverable. Its piece table still has the marks,
  // so the body is read from there. The version is pinned for this reason.
  const raw = extractor._pieces
    .map((piece) => piece.text)
    .join('')
    .slice(0, extractor._boundaries.ccpText);
  const { wordDocument, table } = streams;
  const body =
    container && wordDocument && table
      ? markOverflowRowEnds(
          raw,
          {
            wordDocument,
            table,
            data: await readOptionalStream(container, 'Data'),
          },
          extractor._pieces
        )
      : raw;
  return {
    pages: body.split('\f').map(blocksFromText),
    header: distinctLines(
      document.getHeaders({ filterUnicode: false, includeFooters: false })
    ),
    footer: distinctLines(document.getFooters({ filterUnicode: false })),
    notes: distinctLines(
      document.getFootnotes({ filterUnicode: false }) +
        '\n' +
        document.getEndnotes({ filterUnicode: false })
    ),
  };
};

const streamEntry = (document: OleCompoundDoc, name: string) => {
  const { streams } = document._rootStorage._dirEntry;
  // The library decodes entry names as UTF-16 from an odd byte count. Node's
  // Buffer drops the odd byte; webpack's browser polyfill decodes it as a
  // trailing NUL, so in the browser every stream is named "WordDocument\0".
  // That is why .doc previews failed in the browser while passing in Node.
  return streams[name] ?? streams[`${name}\0`];
};

const readStream = async (document: OleCompoundDoc, name: string) => {
  const entry = streamEntry(document, name);
  if (!entry) {
    throw new Error(`Missing ${name} stream`);
  }
  const isShort = entry.size < document._header.shortStreamMax;
  const table = isShort ? document._SSAT : document._SAT;
  const secIds = table.getSecIdChain(entry.secId);
  const sectors = isShort
    ? await document._readShortSectors(secIds)
    : await document._readSectors(secIds);
  return sectors.slice(0, entry.size);
};

/** Reads a stream that only some files have. */
const readOptionalStream = async (document: OleCompoundDoc, name: string) =>
  streamEntry(document, name) ? await readStream(document, name) : undefined;

/**
 * Builds blocks from the body text, in which `\r` ends a paragraph, `\x07`
 * ends a table cell and `\n` ends a table row (the library's marker, which
 * `markOverflowRowEnds` adds for the rows it misses).
 *
 * One ambiguity can't be resolved from the text alone: paragraphs that end
 * just before a row's first cell could be that cell's earlier paragraphs or
 * body text before a new table. Body text is assumed, since text between
 * tables is far more common than a multi-paragraph first column. The cost is
 * that such a cell keeps only its last paragraph, and if it's in a later row
 * the table is shown as two.
 */
export const blocksFromText = (text: string): LegacyWordBlock[] => {
  const blocks: LegacyWordBlock[] = [];
  let rows: LegacyWordCell[][] = [];
  let cells: LegacyWordCell[] = [];
  // Paragraphs already ended but not yet known to be body text or cell text.
  let pending: string[] = [];
  let current = '';

  const endTable = () => {
    if (rows.length > 0) {
      blocks.push({ type: 'table', rows });
      rows = [];
    }
  };
  const endBodyParagraphs = () => {
    endTable();
    blocks.push(
      ...pending.map((p) => ({ type: 'paragraph' as const, text: p }))
    );
    pending = [];
  };

  for (const char of resolveFields(text)) {
    if (char === '\r') {
      pending.push(current);
      current = '';
      if (rows.length > 0 && cells.length === 0) {
        endTable();
      }
    } else if (char === '\x07') {
      const paragraphs = [...pending, current];
      current = '';
      pending = [];
      const startsTable = rows.length === 0 && cells.length === 0;
      if (startsTable && paragraphs.length > 1) {
        pending = paragraphs.slice(0, -1);
        endBodyParagraphs();
        cells.push([paragraphs[paragraphs.length - 1]!]);
      } else {
        cells.push(paragraphs);
      }
    } else if (char === '\n') {
      if (cells.length === 0) {
        pending.push(current);
      } else {
        if (pending.length > 0 || current) {
          cells.push([...pending, current]);
        }
        rows.push(cells);
        cells = [];
        pending = [];
      }
      current = '';
    } else {
      current += char;
    }
  }
  if (cells.length > 0) {
    rows.push(cells);
  }
  if (current) {
    pending.push(current);
  }
  endBodyParagraphs();
  return blocks.map(cleanBlock);
};

/** The streams of a .doc file that hold paragraph properties. */
export interface WordStreams {
  /** The file information block and the property pages. */
  wordDocument: Buffer;
  /** The index of property pages, among other tables. */
  table: Buffer;
  /** Properties too large for their page. Not every file has this stream. */
  data?: Buffer;
}

/** A piece table entry: where a run of text sits in the file and in the text. */
interface Piece {
  startCp: number;
  startFilePos: number;
  endFilePos: number;
  /** Bytes per character: 1 for 8-bit pieces, 2 for Unicode. */
  bpc: number;
}

// Paragraph properties are a list of modifiers: a 2-byte code, then an operand.
/** The properties are stored in the Data stream (sprmPHugePapx). */
const overflowCode = 0x6646;
/** The paragraph is a row's end mark (sprmPFTtp). */
const rowEndCode = 0x2417;

/**
 * Marks the row ends the library misses, which leave a row running on into
 * the next with an extra empty cell between them.
 *
 * A row's end is a cell mark whose paragraph has the row-end property. The
 * library reads each paragraph's properties from the property pages, but when
 * they don't fit on the page (a 7-column row with borders and shading needs
 * about 500 bytes), Word stores only a pointer there and the properties in
 * the Data stream. The library doesn't follow the pointer, so this does.
 */
export const markOverflowRowEnds = (
  text: string,
  streams: WordStreams,
  pieces: Piece[]
) => {
  const { data } = streams;
  if (!data) {
    return text;
  }
  const rowEnds: number[] = [];
  for (const paragraph of paragraphProperties(streams)) {
    const pointer = modifiers(paragraph.properties).find(
      (modifier) => modifier.code === overflowCode
    );
    if (!pointer || pointer.operand.length < 4) {
      continue;
    }
    const offset = pointer.operand.readUInt32LE(0);
    if (offset + 2 > data.length) {
      continue;
    }
    const size = data.readUInt16LE(offset);
    const stored = data.slice(offset + 2, offset + 2 + size);
    if (!modifiers(stored).some((modifier) => modifier.code === rowEndCode)) {
      continue;
    }
    const start = characterPosition(pieces, paragraph.start);
    const end = characterPosition(pieces, paragraph.end);
    if (start === undefined || end === undefined) {
      continue;
    }
    for (const [i, char] of text.slice(start, end).split('').entries()) {
      if (char === '\x07') {
        rowEnds.push(start + i);
      }
    }
  }
  let marked = '';
  let last = 0;
  for (const cp of rowEnds.sort((a, b) => a - b)) {
    marked += text.slice(last, cp) + '\n';
    last = cp + 1;
  }
  return marked + text.slice(last);
};

/** Every paragraph's file position range and property modifiers. */
const paragraphProperties = ({ wordDocument, table }: WordStreams) => {
  const result: Array<{ start: number; end: number; properties: Buffer }> = [];
  // The file information block says where the index of property pages is
  const indexOffset = wordDocument.readUInt32LE(0x0102);
  const indexSize = wordDocument.readUInt32LE(0x0106);
  const index = table.slice(indexOffset, indexOffset + indexSize);
  // The index is pageCount + 1 file positions, then a number for each page
  const pageCount = Math.floor((indexSize - 4) / 8);
  const pageNumbers = Array.from({ length: pageCount }, (_, i) =>
    index.readUInt32LE((pageCount + 1) * 4 + i * 4)
  );
  for (const pageNumber of pageNumbers) {
    const page = wordDocument.slice(pageNumber * 512, (pageNumber + 1) * 512);
    if (page.length < 512) {
      continue;
    }
    // A page is count + 1 file positions, a 13-byte entry per paragraph, the
    // property blocks, and the count in its last byte.
    const count = page.readUInt8(511);
    const paragraphs = Array.from({ length: count }, (_, j) => ({
      start: page.readUInt32LE(j * 4),
      end: page.readUInt32LE((j + 1) * 4),
      // An entry starts with the block's offset in words; 0 means defaults
      wordOffset: page.readUInt8((count + 1) * 4 + j * 13),
    }));
    for (const { start, end, wordOffset } of paragraphs) {
      if (wordOffset === 0) {
        continue;
      }
      const at = wordOffset * 2;
      // The block's size is in words, less a byte, unless that is 0: then the
      // next byte holds it, in words exactly.
      const halfSize = page.readUInt8(at);
      const block =
        halfSize !== 0
          ? page.slice(at + 1, at + 1 + 2 * halfSize - 1)
          : page.slice(at + 2, at + 2 + 2 * page.readUInt8(at + 1));
      // The block starts with the style index; the modifiers follow
      result.push({ start, end, properties: block.slice(2) });
    }
  }
  return result;
};

/** Splits a property block into its modifiers. */
const modifiers = (block: Buffer) => {
  const result: Array<{ code: number; operand: Buffer }> = [];
  let offset = 0;
  while (offset + 2 <= block.length) {
    const code = block.readUInt16LE(offset);
    offset += 2;
    const size = operandSize(code, block.slice(offset));
    result.push({ code, operand: block.slice(offset, offset + size) });
    offset += size;
  }
  return result;
};

/** The operand's size is in the code's top three bits, unless it's variable. */
const operandSize = (code: number, operand: Buffer) => {
  switch (code >> 13) {
    case 0:
    case 1:
      return 1;
    case 2:
    case 4:
    case 5:
      return 2;
    case 3:
      return 4;
    case 7:
      return 3;
    default: {
      // Variable: the first byte is the size, except for table definitions
      // (sprmTDefTable and its Word 6 form), where the first two bytes are.
      const isTableDefinition = code === 0xd608 || code === 0xd606;
      const [low = 0, high = 0] = operand;
      return (isTableDefinition ? low + (high << 8) : low) + 1;
    }
  }
};

/** Where a file position falls in the text, through the piece table. */
const characterPosition = (pieces: Piece[], filePosition: number) => {
  const piece = pieces.find(
    (candidate) =>
      filePosition >= candidate.startFilePos &&
      filePosition <= candidate.endFilePos
  );
  return (
    piece && piece.startCp + (filePosition - piece.startFilePos) / piece.bpc
  );
};

/**
 * Keeps a field's result and drops its code, e.g. `\x13 PAGE \x14 3 \x15` → `3`.
 * Fields nest, so this repeats until nothing matches.
 */
// eslint-disable-next-line no-control-regex -- matching Word's control characters is the point
const fieldPattern = /\x13[^\x13\x14\x15]*(?:\x14([^\x13\x14\x15]*))?\x15/g;
const resolveFields = (text: string) => {
  let result = text.replace(/\0/g, ''); // text the author deleted with tracked changes
  let previous;
  do {
    previous = result;
    result = result.replace(fieldPattern, '$1');
  } while (result !== previous);
  return result;
};

const cleanBlock = (block: LegacyWordBlock): LegacyWordBlock =>
  block.type === 'paragraph'
    ? { type: 'paragraph', text: cleanText(block.text) }
    : {
        type: 'table',
        rows: block.rows.map((cells) =>
          cells.map((cell) => cell.map(cleanText))
        ),
      };

const controlCharacters: Record<string, string> = {
  '\x01': '[image]', // inline picture
  '\x02': '', // footnote reference
  '\x05': '', // comment reference
  '\x08': '', // drawn object
  '\x0b': '\n', // manual line break
  '\x1e': '‑', // non-breaking hyphen
  '\x1f': '', // optional hyphen
};
// eslint-disable-next-line no-control-regex -- matching Word's control characters is the point
const controlCharacterPattern = /[\x01\x02\x05\x08\x0b\x1e\x1f]/g;
const cleanText = (text: string) =>
  text.replace(
    controlCharacterPattern,
    (char) => controlCharacters[char] ?? ''
  );

/** Headers are concatenated across sections; show each distinct line once. */
const distinctLines = (text: string) =>
  [
    ...new Set(
      text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
    ),
  ].join('\n');
