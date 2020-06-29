import { books } from './bibleBooks';
import { Nullable } from '..';

interface ScriptureReference {
  book: string;
  chapter: number;
  verse: number;
}

export interface Range<T> {
  start: T;
  end: T;
}

type VerseRange = Range<number>;

type RawScriptureRange = Range<Nullable<ScriptureReference>>;

export type ScriptureRange = Range<Required<ScriptureReference>>;

export const parseScriptureRange = (
  bookName: string,
  reference: string
): RawScriptureRange | null => {
  // Lookup the book
  const bookIndex = bookIndexFromName(bookName);

  const [start, end] = reference.split('-');

  // want to be able to set startVerse later if necessary
  // eslint-disable-next-line prefer-const
  let [startChapter, startVerse] = start.split(':').map(Number);

  const endParts = end?.split(':').map(Number);
  let endChapter: number | undefined = undefined;
  let endVerse: number | undefined = undefined;

  // it can be either a chapter or a verse
  if (endParts?.length === 1) {
    // {chapter}:{verse}-{verse}
    if (startChapter && startVerse) {
      endChapter = startChapter;
      endVerse = endParts[0];
    }
    // {chapter}-{chapter}
    else if (startChapter && !startVerse) {
      startVerse = 1;
      endChapter = endParts[0];
      endVerse = books[bookIndex].verses[endChapter - 1];
    }
  }
  // {chapter}:{verse}-{chapter}:{verse}
  else if (endParts?.length > 0) {
    endChapter = endParts[0];
    endVerse = endParts[1];
  }

  // {chapter}
  if (!end && !startVerse) {
    startVerse = 1;
    endChapter = startChapter;
    endVerse = books[bookIndex].verses[startChapter - 1];
  }

  return {
    start: {
      book: bookName,
      chapter: startChapter,
      verse: startVerse,
    },
    end: {
      book: bookName,
      // if the reference is only say "Ruth 1", then end of the range's chapter will be 1
      chapter: endChapter || startChapter,
      // if it's "Ruth 1:2", then the end of the range's verse will be 2, the same as the start of the range's verse
      verse: endVerse || startVerse,
    },
  };
};

export const validateScriptureRange = (
  range: RawScriptureRange
): ScriptureRange => {
  Object.keys(range).map((part: string) => {
    // part (p) being start or end
    const p = (range as any)[part];
    const bookName = p.book;
    const bookIndex = bookIndexFromName(bookName);
    // verses refers to an array of verse numbers with each index being a chapter
    const chaptersInBook = books[bookIndex].verses.length;
    const chapterIndex = p.chapter - 1;
    const versesInChapter = books[bookIndex].verses[chapterIndex];
    if (p.chapter > chaptersInBook) {
      throw new Error(`${bookName} only has ${chaptersInBook} chapters`);
    } else if (p.verse > versesInChapter) {
      throw new Error(
        `${bookName}: ${p.chapter} only has ${versesInChapter} verses`
      );
    }
  });
  return range as ScriptureRange;
};

// Given a string of a book name (shortened or full length), get the book id
export const bookIndexFromName = (name: string) => {
  name = name.toLowerCase();
  const book = books.find((book) => {
    const bookNames = book.names.map((n) => n.toLowerCase());
    return bookNames.includes(name);
  });
  if (book) {
    return books.indexOf(book);
  }
  throw new Error('No book matched "' + name + '"');
};

// Given a book id, get the full length book name
const bookNameFromId = (id: number) => {
  const book = books[id];
  if (!book) {
    throw new Error('Book id out of range (no such book)');
  }
  return book.names[0];
};

export const scriptureToVerseRange = (
  scriptureRange: ScriptureRange
): VerseRange => {
  if (scriptureRange.start.chapter > scriptureRange.end.chapter) {
    throw new Error('The start chapter must be less than the end chapter');
  } else if (
    scriptureRange.start.chapter === scriptureRange.end.chapter &&
    scriptureRange.start.verse > scriptureRange.end.verse
  ) {
    throw new Error(
      'The start verse must be less than the end verse in the same chapter'
    );
  }

  const start = toVerseId(scriptureRange.start.book, scriptureRange.start);
  const end = toVerseId(scriptureRange.start.book, scriptureRange.end);

  return {
    start,
    end,
  };
};

const toVerseId = (
  bookName: string,
  scriptureRangePart: ScriptureReference
) => {
  let verseCount = 0;
  // 1. grab all verses in Bible before current book
  // 2. grab all verses in chapters up to current chapter
  // 3. grab all verses in current chapter including current verse
  let bookIndex = bookIndexFromName(bookName);
  while (bookIndex >= 1) {
    // get and accumulate verses from the previous book down (hence the - 1)
    verseCount += versesInBookId(bookIndex - 1);
    bookIndex -= 1;
  }

  const chapterIndex = scriptureRangePart.chapter - 1;
  // reset bookIndex to the current book (needed because of the above while loop)
  bookIndex = bookIndexFromName(bookName);
  // add all verses from previous chapters, but not the current one since we only add through the verse, not the whole chapter
  let i = 0;
  while (i < chapterIndex) {
    // add all chapters starting with the first
    verseCount += books[bookIndex].verses[i];
    i += 1;
  }
  // this is to start the absolute verse number counting at 0 –– "Genesis 1:1" has an AVN of 0 "Genesis 1:2" is 1, etc
  verseCount += scriptureRangePart.verse - 1;
  return verseCount;
};

const versesInBookId = (bookIndex: number) => {
  const total = books[bookIndex].verses.reduce(function sum(a, b) {
    return a + b;
  });
  return total;
};

export const verseToScriptureRange = (range: VerseRange): ScriptureRange => {
  return {
    start: {
      ...verseIdToReference(range.start),
    },
    end: { ...verseIdToReference(range.end) },
  };
};
const verseIdToReference = (verseId: number): ScriptureReference => {
  // let's add one here since we start counting from 0 - it will make calculations simpler and will fix the 1-offset for the scripture reference verse number
  let versesRemaining = verseId + 1;
  let bookIndex = 0;

  // versesRemaining will equal 0 when it's Genesis 1:1
  while (versesRemaining > 0) {
    const versesInThisBook = versesInBookId(bookIndex);
    // if the range is the whole book like Ruth 1-4, then versesRemaining - versesInThisBook will be 0
    if (versesRemaining - versesInThisBook <= 0) {
      const book = books[bookIndex];
      let chapterIndex = 0;
      // again here versesRemaining will equal 0 when it's Gen 1:1
      while (versesRemaining > 0) {
        const versesInThisChapter = book.verses[chapterIndex];

        // if it's {chapter}-{chapter} versesRemaining - versesInThisChapter will equal 0
        // I don't think bibleJs - https://github.com/davewasmer/biblejs allowed chapter-chapter references
        if (versesRemaining - versesInThisChapter <= 0) {
          return {
            book: bookNameFromId(bookIndex),
            chapter: chapterIndex + 1,
            verse: versesRemaining,
          };
        }
        versesRemaining -= versesInThisChapter;
        chapterIndex += 1;
      }
    }
    versesRemaining -= versesInThisBook;
    bookIndex += 1;
  }
  throw new Error('Invalid verse number');
};

export const formatScriptureRange = (range: ScriptureRange): string => {
  validateScriptureRange(range);
  const {
    start: { book: bookName, chapter: startChapter, verse: startVerse },
    end: { chapter: endChapter, verse: endVerse },
  } = range;

  const bookIndex = bookIndexFromName(bookName);
  const endChapterIndex = endChapter - 1;

  if (startChapter !== endChapter) {
    // {chapter}-{chapter}
    if (
      startVerse === 1 &&
      // if endVerse equals the number of verses in endChapter we know it's a chapter-chapter reference
      endVerse === books[bookIndex].verses[endChapterIndex]
    ) {
      return `${startChapter}-${endChapter}`;
    }
    // {chapter}:{verse}-{chapter}:{verse}
    return `${startChapter}:${startVerse}-${endChapter}:${endVerse}`;
  }

  // __________ we know at this point that startChapter and endChapter are the same __________ //

  // {chapter}
  if (
    startVerse === 1 &&
    endVerse === books[bookIndex].verses[endChapterIndex]
  ) {
    return `${startChapter}`;
  }
  // {chapter}:{verse}
  else if (startVerse === endVerse) {
    return `${startChapter}:${startVerse}`;
  }
  // {chapter}:{verse}-{verse}
  return `${startChapter}:${startVerse}-${endVerse}`;
};
