import { books } from './bibleBooks';
import { Nullable } from '..';

interface ScriptureReference {
  book: string;
  chapter: number;
  verse?: number;
}

interface Range<T> {
  start: T;
  end: T;
}

type RawScriptureRange = Range<Nullable<ScriptureReference>>;

// Internally, no strings are stored - only numbers.
//
// "id"s are UIDs, numbers are relative to parent unit; e.g.
// Mark 2 and James 2 have different ids, but the same number.

export const parseScriptureRange = (
  bookName: string,
  reference: string
): RawScriptureRange | null => {
  // Lookup the book
  const bookId = bookIdFromName(bookName);

  const [start, end] = reference.split('-');

  // want to be able to set startVerse later if necessary
  // eslint-disable-next-line prefer-const
  let [startChapter, startVerse] = start.split(':').map(Number);

  const endParts = end?.split(':').map(Number);
  let endChapter: number | undefined = undefined;
  let endVerse: number | undefined = undefined;

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
      endVerse = books[bookId - 1].verses[endChapter - 1];
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
    endVerse = books[bookId - 1].verses[startChapter - 1];
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

// Like moment.js startOf - ref.startOf('chapter') sets the ref to the first
// verse in it's chapter
// const startOf = (unit: string) => {
//   if (unit === 'chapter') {
//     this.verse = 1;
//   } else if (unit === 'book') {
//     this.verse = 1;
//     this.chapter = 1;
//   } else {
//     throw new Error(
//       'Unknown unit ' +
//         unit +
//         ' supplied to startOf() - supported units are: "book", "chapter"'
//     );
//   }
//   return this;
// };

// // String formatting
// const toString = () => {
//   const bookName = books[this.book - 1].names[0];
//   const stringified = bookName + ' ' + this.chapter;
//   if (this.verse != null) {
//     stringified += ':' + this.verse;
//   }
//   return stringified;
// };

// // Get the verse id for this reference
// const toVerseId = () => {
//   const verseCount = 0;
//   const bookIndex = this.book - 1;
//   while (bookIndex >= 1) {
//     verseCount += Reference.versesInBookId(bookIndex);
//     bookIndex -= 1;
//   }
//   const chapterIndex = this.chapter - 1;
//   while (chapterIndex >= 1) {
//     verseCount += Reference.versesInBookId(bookIndex);
//     verseCount += books[this.book - 1].verses[chapterIndex];
//   }
//   if (this.verse != null) {
//     verseCount += this.verse;
//   }
//   return verseCount;
// };

// // Get the chapter id for this reference
// const toChapterId = () => {
//   const previousBookChapters = Reference.chaptersUpToBookId(this.book);
//   return previousBookChapters + this.chapter;
// };

// // Get the book id for this reference
// const toBookId = () => {
//   return this.book;
// };

// // When doing math, use verse id as the value
// const valueOf = () => {
//   return this.toVerseId();
// };

// Given a string of a book name (shortened or full length), get the book id
const bookIdFromName = (name: string) => {
  name = name.toLowerCase();
  const book = books.find((book) => {
    const bookNames = book.names.map((n) => n.toLowerCase());
    return bookNames.includes(name);
  });
  if (book) {
    return books.indexOf(book) + 1;
  }
  throw new Error('No book matched "' + name + '"');
};

// Given a book id, get the full length book name
const bookNameFromId = (id: number) => {
  const book = books[id - 1];
  if (!book) {
    throw new Error('Book id out of range (no such book)');
  }
  return book.names[0];
};

// // Create a Reference from a chapter id. Count up through the books to find
// // that number chapter
// const fromChapterId = (chapterId: number) => {
//   const chaptersRemaining = chapterId;
//   const bookIndex = 0;
//   while (chaptersRemaining > 0) {
//     const chaptersInThisBook = books[bookIndex].verses.length;
//     if (chaptersRemaining - chaptersInThisBook <= 0) {
//       return new Reference({ book: bookIndex + 1, chapter: chaptersRemaining });
//     }
//     chaptersRemaining -= chaptersInThisBook;
//     bookIndex += 1;
//   }
//   throw new Error(
//     'There was a problem creating the a reference from chapter id ' + chapterId
//   );
// };

// // Create a Reference from a verse id
// const fromVerseId = (verseId: number) => {
//   const versesRemaining = verseId;
//   const bookIndex = 0;
//   while (versesRemaining > 0) {
//     const versesInThisBook = Reference.versesInBookId(bookIndex + 1);
//     if (versesRemaining - versesInThisBook < 0) {
//       const book = books[bookIndex];
//       const chapterIndex = 0;
//       while (versesRemaining > 0) {
//         const versesInThisChapter = book.verses[chapterIndex];
//         if (versesRemaining - versesInThisChapter < 0) {
//           return new Reference({
//             book: bookIndex + 1,
//             chapter: chapterIndex + 1,
//             verse: versesRemaining,
//           });
//         }
//         versesRemaining -= versesInThisChapter;
//         chapterIndex += 1;
//       }
//     }
//     versesRemaining -= versesInThisBook;
//     bookIndex += 1;
//   }
// };

// // Get the number of verses in the given book id
// const versesInBookId = (bookId: number) => {
//   return books[bookId - 1].verses.reduce(function sum(a, b) {
//     return a + b;
//   });
// };

// // Get the number of verses in the given chapter id
// const versesInChapterId = (chapterId: number) => {
//   const reference = Reference.fromChapterId(chapterId);
//   return books[reference.book - 1].verses[reference.chapter - 1];
// };

// Get the number of chapters in the given book id
const chaptersInBookId = (bookId: number) => {
  return books[bookId - 1].verses.length;
};

// // Get the number of verses up to the start of the given book id
// const versesUpToBookId = (bookId: number) => {
//   const count = 0;
//   const booksLeft = bookId - 1;
//   while (booksLeft > 0) {
//     count += Reference.versesInBookId(booksLeft);
//     booksLeft -= 1;
//   }
//   return count;
// };

// // Get the number of verses up to the start of the given chapter id
// const versesUpToChapterId = (chapterId: number) => {
//   const count = 0;
//   const chaptersLeft = chapterId - 1;
//   while (chaptersLeft > 0) {
//     count += Reference.versesInChapterId(chaptersLeft);
//     chaptersLeft -= 1;
//   }
//   return count;
// };

// // Get the number of chapters up to the start of the given book id
// const chaptersUpToBookId = (bookId: number) => {
//   const count = 0;
//   const booksLeft = bookId - 1;
//   while (booksLeft > 0) {
//     count += Reference.chaptersInBookId(booksLeft);
//     booksLeft -= 1;
//   }
//   return count;
// };
