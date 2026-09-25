import { getFullBookRange } from '~/common';
import {
  newBookKey,
  toScriptureBooks,
  toScriptureReferences,
  toUnspecifiedScripture,
} from './scriptureBooks';

const markRange = {
  start: { book: 'Mark', chapter: 1, verse: 1 },
  end: { book: 'Mark', chapter: 2, verse: 5 },
};

describe('scriptureBooks', () => {
  it('creates one entry per book', () => {
    expect(toScriptureBooks([getFullBookRange('Matthew'), markRange])).toEqual({
      book1: { book: 'Matthew', bookSelection: 'full' },
      book2: {
        book: 'Mark',
        bookSelection: 'partialKnown',
        scriptureReferences: [markRange],
      },
    });
  });

  it('converts entries back to the same references', () => {
    const apiRanges = [getFullBookRange('Matthew'), markRange];

    expect(toScriptureReferences(toScriptureBooks(apiRanges))).toEqual(
      apiRanges
    );
  });

  it('creates one empty entry when there are no references', () => {
    expect(toScriptureBooks([])).toEqual({
      book1: { bookSelection: 'full' },
    });
  });

  it('keeps an unspecified portion as a verse count entry', () => {
    const scriptureBooks = toScriptureBooks([], {
      book: 'Luke',
      totalVerses: 20,
    });

    expect(toScriptureReferences(scriptureBooks)).toEqual([]);
    expect(toUnspecifiedScripture(scriptureBooks)).toEqual({
      book: 'Luke',
      totalVerses: 20,
    });
  });

  it('skips entries without a book', () => {
    expect(toScriptureReferences({ book1: { bookSelection: 'full' } })).toEqual(
      []
    );
  });

  it('creates a key after the highest existing key', () => {
    expect(
      newBookKey({
        book1: { bookSelection: 'full' },
        book3: { bookSelection: 'full' },
      })
    ).toBe('book4');
  });
});
