import { compact } from 'lodash';

export type Many<T> = T | readonly T[];

export const many = <T>(items: Many<T>): readonly T[] =>
  Array.isArray(items) ? items : [items];

/** Converts a CSV string into a cleaned list */
export const csv = (list: string, separator = ','): string[] =>
  compact(list.split(separator).map((i) => i.trim()));
