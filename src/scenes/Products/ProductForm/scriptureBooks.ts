import { groupToMapBy } from '@seedcompany/common';
import { UnspecifiedScripturePortionInput } from '~/api/schema.graphql';
import { getFullBookRange, isFullBookRange, ScriptureRange } from '~/common';

export type BookSelection = 'full' | 'partialKnown' | 'partialUnknown';

export interface ScriptureBookEntry {
  book?: string | null;
  bookSelection: BookSelection;
  scriptureReferences?: readonly ScriptureRange[] | null;
  totalVerses?: number | null;
}

/**
 * Book entries keyed by a stable key, so removing one entry does not shift
 * the field names of the others.
 */
export type ScriptureBooks = Record<string, ScriptureBookEntry>;

/**
 * Creates a key for a new book entry that is unique within the given entries.
 *
 * The key is never numeric, so final-form keeps the entries as an object.
 *
 * @example
 * ```ts
 * newBookKey({ book1: entry, book3: entry });
 * // => "book4"
 * ```
 */
export function newBookKey(scriptureBooks: ScriptureBooks = {}) {
  const keyNumbers = Object.keys(scriptureBooks).map((key) =>
    Number(key.replace(/^book/, ''))
  );
  return `book${Math.max(0, ...keyNumbers.filter(Number.isInteger)) + 1}`;
}

/**
 * Creates the book entries with one empty entry.
 */
export function emptyScriptureBooks(): ScriptureBooks {
  return toKeyedBooks([{ bookSelection: 'full' }]);
}

function toKeyedBooks(bookEntries: ScriptureBookEntry[]): ScriptureBooks {
  return Object.fromEntries(
    bookEntries.map((entry, index) => [`book${index + 1}`, entry])
  );
}

/**
 * Converts API scripture into one book entry per book.
 *
 * @example
 * ```ts
 * toScriptureBooks([getFullBookRange('Matthew')]);
 * // => { book1: { book: 'Matthew', bookSelection: 'full' } }
 * ```
 */
export function toScriptureBooks(
  scriptureReferences: readonly ScriptureRange[],
  unspecifiedScripture?: UnspecifiedScripturePortionInput | null
): ScriptureBooks {
  if (unspecifiedScripture) {
    return toKeyedBooks([
      {
        book: unspecifiedScripture.book,
        bookSelection: 'partialUnknown',
        totalVerses: unspecifiedScripture.totalVerses,
      },
    ]);
  }

  const rangesByBook = groupToMapBy(
    scriptureReferences,
    (range) => range.start.book
  );
  if (rangesByBook.size === 0) {
    return emptyScriptureBooks();
  }

  return toKeyedBooks(
    [...rangesByBook].map(
      ([book, bookRanges]): ScriptureBookEntry =>
        bookRanges.length === 1 && isFullBookRange(bookRanges[0], book)
          ? { book, bookSelection: 'full' }
          : {
              book,
              bookSelection: 'partialKnown',
              scriptureReferences: bookRanges,
            }
    )
  );
}

/**
 * Converts the book entries into the scripture references for the API.
 *
 * Entries without a book, or with only a verse count, are skipped.
 */
export function toScriptureReferences(
  scriptureBooks: ScriptureBooks | undefined
): ScriptureRange[] {
  return Object.values(scriptureBooks ?? {}).flatMap((entry) => {
    if (!entry.book) return [];
    if (entry.bookSelection === 'full') return [getFullBookRange(entry.book)];
    if (entry.bookSelection === 'partialKnown') {
      return entry.scriptureReferences ?? [];
    }
    return [];
  });
}

/**
 * Finds the unspecified scripture portion in the book entries.
 */
export function toUnspecifiedScripture(
  scriptureBooks: ScriptureBooks | undefined
): UnspecifiedScripturePortionInput | null {
  const unspecifiedEntry = Object.values(scriptureBooks ?? {}).find(
    (entry) =>
      entry.book &&
      entry.bookSelection === 'partialUnknown' &&
      entry.totalVerses
  );
  return unspecifiedEntry
    ? {
        book: unspecifiedEntry.book!,
        totalVerses: unspecifiedEntry.totalVerses!,
      }
    : null;
}
