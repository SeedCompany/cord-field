// Deep imports into word-extractor's OLE path, which has no typings.
// Only the Word 97 (binary .doc) side is used; its docx path needs Node streams.

declare module 'word-extractor/lib/buffer-reader' {
  class BufferReader {
    constructor(buffer: Buffer);
  }
  export = BufferReader;
}

declare module 'word-extractor/lib/word-ole-extractor' {
  import type BufferReader from 'word-extractor/lib/buffer-reader';

  interface TextOptions {
    filterUnicode?: boolean;
    /** `getHeaders` only; defaults to true, which appends the footers. */
    includeFooters?: boolean;
  }

  class ExtractedDocument {
    getBody(options?: TextOptions): string;
    getHeaders(options?: TextOptions): string;
    getFooters(options?: TextOptions): string;
    getFootnotes(options?: TextOptions): string;
    getEndnotes(options?: TextOptions): string;
  }

  class WordOleExtractor {
    /**
     * Internal piece table, populated by `extract`. Text still carries Word's
     * control characters, which the public getters fold away.
     */
    _pieces: Array<{ text: string }>;
    /** Internal character counts for each document part, populated by `extract`. */
    _boundaries: { ccpText: number };
    extract(reader: BufferReader): Promise<ExtractedDocument>;
  }
  export = WordOleExtractor;
}
