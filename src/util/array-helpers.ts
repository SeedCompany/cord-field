import { compact, fill, times } from 'lodash';

export type ArrayItem<T> = T extends ReadonlyArray<infer U> ? U : never;

export type Many<T> = T | readonly T[];

export const many = <T>(items: Many<T>): readonly T[] =>
  Array.isArray(items) ? items : [items as T];

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

/**
 * Just like Object.entries except keys are strict
 */
export const entries: <K extends string, V>(
  o: Record<K, V>
) => Array<[K, V]> = Object.entries as any;

/**
 * Just like Object.keys except keys are strict
 */
export const keys: <K extends string>(
  o: Record<K, unknown>
) => K[] = Object.keys as any;

/** Converts list to map given a function that returns a [key, value] tuple. */
export const mapFromList = <T, S = T, K extends string = string>(
  list: T[],
  mapper: (item: T) => [K, S]
): Record<K, S> => {
  const out: Partial<Record<K, S>> = {};
  return list.reduce((acc, item) => {
    const [key, value] = mapper(item);
    acc[key] = value;
    return acc;
  }, out as Record<K, S>);
};
