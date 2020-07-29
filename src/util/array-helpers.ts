import { compact, fill, times } from 'lodash';

export type ArrayItem<T> = T extends ReadonlyArray<infer U> ? U : never;

export type Many<T> = T | readonly T[];

export const many = <T>(items: Many<T>): readonly T[] =>
  Array.isArray(items) ? items : [items];

/** Converts a CSV string into a cleaned list */
export const csv = <T extends string = string>(
  list: string,
  separator = ','
): T[] => compact(list.split(separator).map((i) => i.trim() as T));

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
