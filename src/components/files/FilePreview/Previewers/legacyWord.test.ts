import { readFileSync } from 'fs';
import { join } from 'path';
import {
  blocksFromText,
  markOverflowRowEnds,
  parseLegacyWord,
} from './legacyWord';

// A Word 97 file with a heading, paragraphs, a bulleted list, a 3x3 table
// whose last column has a two-paragraph cell and an empty cell, and a
// closing paragraph. Made on macOS with `textutil -convert doc`.
const fixture = () => {
  const buffer = readFileSync(join(__dirname, '__fixtures__/legacy-word.doc'));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );
};

describe('parseLegacyWord', () => {
  it('recovers paragraphs and tables from a Word 97 file', async () => {
    const document = await parseLegacyWord(fixture());

    expect(document.pages).toHaveLength(1);
    const blocks = document.pages[0]!;
    expect(blocks[0]).toEqual({ type: 'paragraph', text: 'Quarterly Update' });
    expect(blocks).toContainEqual({
      type: 'paragraph',
      text: 'First paragraph with bold and italic text.',
    });
    expect(blocks).toContainEqual({
      type: 'table',
      rows: [
        [['Goal'], ['Met?'], ['Notes']],
        [['Translate Mark'], ['Yes'], ['Para A in cell.', 'Para B in cell.']],
        [['Train checkers'], [''], ['Postponed']],
      ],
    });
    expect(blocks[blocks.length - 1]).toEqual({
      type: 'paragraph',
      text: 'Closing paragraph after the table.',
    });
  });
});

describe('blocksFromText', () => {
  it('keeps field results and drops text deleted with tracked changes', () => {
    expect(
      blocksFromText(
        'See \x13 PAGEREF x \x14page 3\x15 now.\rGone\0\0\0 kept\r'
      )
    ).toEqual([
      { type: 'paragraph', text: 'See page 3 now.' },
      { type: 'paragraph', text: 'Gone kept' },
    ]);
  });
});

describe('markOverflowRowEnds', () => {
  it('marks a row end whose properties are stored in the Data stream', () => {
    // Two cells, a row-end mark, then a paragraph. The text starts at file
    // position 1024 with one byte per character, so the mark is at 1028.
    const text = 'A\x07B\x07\x07C\r';
    const pieces = [
      {
        startCp: 0,
        startFilePos: 1024,
        endFilePos: 1024 + text.length,
        bpc: 1,
      },
    ];

    // The Data stream holds two property blocks: one with the row-end
    // property and one with only the in-table property.
    const data = Buffer.alloc(32);
    data.writeUInt16LE(3, 2);
    data.writeUInt16LE(0x2417, 4);
    data.writeUInt8(1, 6);
    data.writeUInt16LE(3, 10);
    data.writeUInt16LE(0x2416, 12);
    data.writeUInt8(1, 14);

    // Property page 1 lists the row-end mark and the paragraph after it, each
    // pointing at one of those blocks instead of holding its own.
    const wordDocument = Buffer.alloc(1024);
    const page = wordDocument.slice(512, 1024);
    page.writeUInt8(2, 511);
    page.writeUInt32LE(1028, 0);
    page.writeUInt32LE(1029, 4);
    page.writeUInt32LE(1031, 8);
    const entries = (2 + 1) * 4;
    page.writeUInt8(100, entries);
    page.writeUInt8(110, entries + 13);
    const writePointer = (at: number, dataOffset: number) => {
      page.writeUInt8(0, at);
      page.writeUInt8(4, at + 1);
      page.writeUInt16LE(0, at + 2);
      page.writeUInt16LE(0x6646, at + 4);
      page.writeUInt32LE(dataOffset, at + 6);
    };
    writePointer(200, 2);
    writePointer(220, 10);

    // The file information block points at the index of property pages in
    // the table stream, which lists page 1 only.
    wordDocument.writeUInt32LE(0, 0x0102);
    wordDocument.writeUInt32LE(12, 0x0106);
    const table = Buffer.alloc(12);
    table.writeUInt32LE(1024, 0);
    table.writeUInt32LE(1031, 4);
    table.writeUInt32LE(1, 8);

    expect(
      markOverflowRowEnds(text, { wordDocument, table, data }, pieces)
    ).toBe('A\x07B\x07\nC\r');
  });
});
