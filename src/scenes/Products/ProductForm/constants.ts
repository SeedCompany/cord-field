import { Book } from '@seedcompany/scripture';

const allBooks = [...Book];

export const oldTestament = allBooks
  .filter((book) => book.isOldTestament)
  .map((book) => book.label);

export const newTestament = allBooks
  .filter((book) => book.isNewTestament)
  .map((book) => book.label);

export const productTypes = [
  'DirectScriptureProduct',
  'Story',
  'Film',
  'EthnoArt',
  'Other',
] as const;

export type ProductTypes =
  | (typeof productTypes)[number]
  | 'DerivativeScriptureProduct';
