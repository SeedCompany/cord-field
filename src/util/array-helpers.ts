import { compact, fill, times } from 'lodash';

export type ArrayItem<T> = T extends Array<infer U> ? U : never;

export type Many<T> = T | readonly T[];

export const many = <T>(items: Many<T>): readonly T[] =>
  Array.isArray(items) ? items : [items];

/** Converts a CSV string into a cleaned list */
export const csv = (list: string, separator = ','): string[] =>
  compact(list.split(separator).map((i) => i.trim()));

/**
 * Returns the list if given or a list of undefined items
 *
 * This is mostly to widen the TS type from `A[] | B[]` to `(A | B)[]`
 */
export const listOrPlaceholders = <T>(
  list: readonly T[] | null | undefined,
  placeholderCount: number
): ReadonlyArray<T | undefined> =>
  list ?? fill(times(placeholderCount), undefined);
