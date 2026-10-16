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
  // other browser difference this works around.
  extractor.documentStream = async (document, streamName) =>
    await readStream(document, streamName);
  extractor.streamBuffer = async (buffer) => buffer as Buffer;
  const document = await extractor.extract(new BufferReader(Buffer.from(data)));
  // The library's getters fold cell and row marks into tabs and newlines,
  // which makes tables unrecoverable. Its piece table still has the marks,
  // so the body is read from there. The version is pinned for this reason.
  const raw = extractor._pieces
    .map((piece) => piece.text)
    .join('')
    .slice(0, extractor._boundaries.ccpText);
  return {
    pages: raw.split('\f').map(blocksFromText),
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

const readStream = async (document: OleCompoundDoc, name: string) => {
  const { streams } = document._rootStorage._dirEntry;
  // The library decodes entry names as UTF-16 from an odd byte count. Node's
  // Buffer drops the odd byte; webpack's browser polyfill decodes it as a
  // trailing NUL, so in the browser every stream is named "WordDocument\0".
  // That is why .doc previews failed in the browser while passing in Node.
  const entry = streams[name] ?? streams[`${name}\0`];
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

/**
 * Builds blocks from the body text, in which `\r` ends a paragraph, `\x07`
 * ends a table cell and `\n` ends a table row (the library's own marker).
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
      blocks.push({ type: 'table', rows: splitRunOnRows(rows) });
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

/**
 * The library finds a row's end from a paragraph property it doesn't always
 * reach, and a missed one is left as a plain cell mark. That row then runs
 * on into the next, with one extra empty cell where the row ended: a 7-wide
 * table's header and next row read as 15 cells, the 8th empty.
 *
 * A row is split back apart when it's a whole number of (width + 1) cells
 * longer than another of the table's widths and every cell where a row would
 * have ended is empty. Widths under 2 aren't tried: in a one-column table
 * any row with an empty middle cell would match.
 */
const splitRunOnRows = (rows: LegacyWordCell[][]): LegacyWordCell[][] => {
  const widths = [...new Set(rows.map((cells) => cells.length))]
    .filter((width) => width >= 2)
    .sort((a, b) => a - b);
  return rows.flatMap((cells) => {
    const width = widths.find(
      (w) =>
        w < cells.length &&
        (cells.length - w) % (w + 1) === 0 &&
        cells.every(
          (cell, i) => i % (w + 1) !== w || cell.every((text) => text === '')
        )
    );
    if (!width) {
      return [cells];
    }
    return Array.from({ length: (cells.length + 1) / (width + 1) }, (_, n) =>
      cells.slice(n * (width + 1), n * (width + 1) + width)
    );
  });
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
