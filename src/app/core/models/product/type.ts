import { BibleBook } from '@app/core/models/bible-book';
import { buildEnum } from '@app/core/models/enum';

export enum ProductType {
  // Special Types
  BibleStories = 'bibstories',
  JesusFilm = 'jesusfilm',
  Songs = 'songs',
  LiteracyMaterials = 'litmaterials',

  // Normal Types (can be assumed from books)
  OldTestamentPortions = 'otportions',
  OldTestamentFull = 'otfull',
  Gospel = 'gospel',
  NewTestamentPortions = 'ntportions',
  NewTestamentFull = 'ntfull',
  BibleFull = 'fullbible',
  IndividualBooks = 'individualbooks',
  Genesis = 'genesis',
}

export namespace ProductType {
  export const { entries, forUI, values, trackEntryBy, trackValueBy } = buildEnum(ProductType, {
    [ProductType.BibleStories]: 'Bible Stories',
    [ProductType.JesusFilm]: 'Jesus Film',
    [ProductType.Songs]: 'Songs',
    [ProductType.LiteracyMaterials]: 'Literacy Materials',
    [ProductType.OldTestamentPortions]: 'Old Testament Portions',
    [ProductType.OldTestamentFull]: 'Full Old Testament',
    [ProductType.Gospel]: 'A Gospel',
    [ProductType.NewTestamentPortions]: 'New Testament Portions',
    [ProductType.NewTestamentFull]: 'Full New Testament',
    [ProductType.BibleFull]: 'Full Bible',
    [ProductType.IndividualBooks]: 'Individual Books',
    [ProductType.Genesis]: 'Genesis',
  });

  export const SpecialTypes = [
    ProductType.BibleStories,
    ProductType.JesusFilm,
    ProductType.Songs,
    ProductType.LiteracyMaterials,
  ];

  export const fromBooks = (books: BibleBook[]): ProductType | null => {
    if (!Array.isArray(books) || books.length === 0) {
      return null;
    }
    if (books.length === 66) {
      return ProductType.BibleFull;
    }
    if (books.length === 1 && BibleBook.Gospels.includes(books[0])) {
      return ProductType.Gospel;
    }
    if (books.every(book => BibleBook.NewTestament.includes(book))) {
      return books.length === BibleBook.NewTestament.length
        ? ProductType.NewTestamentFull
        : ProductType.NewTestamentPortions;
    }
    if (books.every(book => BibleBook.OldTestament.includes(book))) {
      return books.length === BibleBook.OldTestament.length
        ? ProductType.OldTestamentFull
        : ProductType.OldTestamentPortions;
    }

    return ProductType.IndividualBooks;
  };

  export const booksFromType = (type: ProductType): BibleBook[] | null => {
    if (type === ProductType.Genesis) {
      return [BibleBook.Genesis];
    }
    if (type === ProductType.BibleFull) {
      return BibleBook.values() as BibleBook[];
    }
    if (type === ProductType.NewTestamentFull) {
      return BibleBook.NewTestament;
    }
    if (type === ProductType.OldTestamentFull) {
      return BibleBook.OldTestament;
    }
    if (type === ProductType.JesusFilm) {
      return [BibleBook.Luke];
    }

    return null;
  };

  export const displaySummary = (books: BibleBook[], type: ProductType, bookLimit = 3) => {
    if (
      books.length === 0 ||
      [
        ProductType.OldTestamentFull,
        ProductType.NewTestamentFull,
        ProductType.BibleFull,
        ProductType.JesusFilm,
        ProductType.Genesis,
      ].includes(type)
    ) {
      return ProductType.forUI(type);
    }

    const prefix = [
      ProductType.OldTestamentPortions,
      ProductType.NewTestamentPortions,
      ProductType.IndividualBooks,
      ProductType.Gospel,
    ].includes(type) ? '' : ProductType.forUI(type) + ' - ';

    const displayBooks = books.slice(0, bookLimit);
    const extraBooks = books.slice(bookLimit);

    return prefix + displayBooks.map(BibleBook.forUI).join(', ') + (extraBooks.length > 0 ? `, + ${extraBooks.length} more` : '');
  };
}
