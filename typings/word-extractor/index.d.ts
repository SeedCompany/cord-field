// Deep imports into word-extractor's OLE path, which has no typings.
// Only the Word 97 (binary .doc) side is used; its docx path needs Node streams.

declare module 'word-extractor/lib/buffer-reader' {
  class BufferReader {
    constructor(buffer: Buffer);
  }
  export = BufferReader;
}

declare module 'word-extractor/lib/ole-compound-doc' {
  interface DirectoryEntry {
    size: number;
    secId: number;
  }
  interface AllocationTable {
    getSecIdChain: (secId: number) => number[];
  }

  /** Internals used to read a stream's sectors without the Node `stream` module. */
  class OleCompoundDoc {
    constructor(reader: import('word-extractor/lib/buffer-reader'));
    read(): Promise<this>;
    _header: { shortStreamMax: number };
    _SAT: AllocationTable;
    _SSAT: AllocationTable;
    _rootStorage: { _dirEntry: { streams: Record<string, DirectoryEntry> } };
    _readSectors(secIds: number[]): Promise<Buffer>;
    _readShortSectors(secIds: number[]): Promise<Buffer>;
  }
  export = OleCompoundDoc;
}

declare module 'word-extractor/lib/word-ole-extractor' {
  import type BufferReader from 'word-extractor/lib/buffer-reader';
  import type OleCompoundDoc from 'word-extractor/lib/ole-compound-doc';

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
     * Internal piece table, populated by `extract`: each run of text, with
     * where it sits in the file and in the text. Text still carries Word's
     * control characters, which the public getters fold away.
     */
    _pieces: Array<{
      text: string;
      startCp: number;
      endCp: number;
      startFilePos: number;
      endFilePos: number;
      /** Bytes per character: 1 for 8-bit pieces, 2 for Unicode. */
      bpc: number;
    }>;
    /** Internal character counts for each document part, populated by `extract`. */
    _boundaries: { ccpText: number };
    extract(reader: BufferReader): Promise<ExtractedDocument>;
    /** How `extract` fetches a named stream; overridable per instance. */
    documentStream(
      document: OleCompoundDoc,
      streamName: string
    ): Promise<unknown>;
    /** How `extract` drains a stream into a buffer; overridable per instance. */
    streamBuffer(stream: unknown): Promise<Buffer>;
  }
  export = WordOleExtractor;
}
