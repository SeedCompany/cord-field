import { readFileSync } from 'fs';
import { join } from 'path';
import { blocksFromText, parseLegacyWord } from './legacyWord';

// A Word 97 file with a heading, paragraphs, a bulleted list, a 3x3 table
// whose last column has a two-paragraph cell and an empty cell, and a
// closing paragraph. Made on macOS with `textutil -convert doc`.
const fixture = () => {
  const buffer = readFileSync(join(__dirname, '__fixtures__/legacy-word.doc'));
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
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
