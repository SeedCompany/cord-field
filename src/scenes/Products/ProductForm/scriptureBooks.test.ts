import { mergeVerseRanges } from '@seedcompany/scripture';
import { getFullBookRange } from '~/common';
import { oldTestament } from './constants';
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

  it('splits a range that crosses books into one entry per book', () => {
    // The API merges adjacent ranges, so two full books come back as one
    const matthewToMark = {
      start: { book: 'Matthew', chapter: 1, verse: 1 },
      end: { book: 'Mark', chapter: 16, verse: 20 },
    };

    expect(toScriptureBooks([matthewToMark])).toEqual({
      book1: { book: 'Matthew', bookSelection: 'full' },
      book2: { book: 'Mark', bookSelection: 'full' },
    });
  });

  it('keeps the same verses through a round trip', () => {
    const matthewToMark = {
      start: { book: 'Matthew', chapter: 1, verse: 1 },
      end: { book: 'Mark', chapter: 16, verse: 20 },
    };
    const entries = toScriptureBooks([matthewToMark]);

    expect(mergeVerseRanges(toScriptureReferences(entries))).toEqual(
      mergeVerseRanges([matthewToMark])
    );
  });

  it('uses the book name that the API uses', () => {
    const scriptureBooks = toScriptureBooks([getFullBookRange('Psalm')]);

    expect(scriptureBooks.book1!.book).toBe('Psalms');
    expect(oldTestament).toContain('Psalms');
  });

  it('creates no references when every book is removed', () => {
    // An empty list overrides a derivative goal to no scripture
    expect(toScriptureReferences({})).toEqual([]);
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
