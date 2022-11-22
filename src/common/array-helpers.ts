import { compact, fill, isEmpty, times } from 'lodash';
import { Nullable } from './types';

export type Many<T> = T | readonly T[];

export const many = <T>(items: Many<T>): readonly T[] =>
  Array.isArray(items) ? items : [items as T];

export const isListNotEmpty = <T>(
  list: Nullable<readonly T[]>
): list is readonly T[] & { 0: T } => !isEmpty(list);

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
 * Just like Object.entries except keys are strict and only pairs that exist are iterated
 */
export const entries: <K extends string, V>(o: { [Key in K]?: V }) => Array<
  [K, V]
> = Object.entries as any;

/**
 * Just like Object.keys except keys are strict
 */
export const keys: <K extends string>(o: Record<K, unknown>) => K[] =
  Object.keys as any;

/** Converts list to map given a function that returns a [key, value] tuple. */
export const mapFromList = <T, S = T, K extends string = string>(
  list: readonly T[],
  mapper: (item: T) => readonly [K, S] | null
): Record<K, S> => {
  const out: Partial<Record<K, S>> = {};
  return list.reduce((acc, item) => {
    const res = mapper(item);
    if (!res) {
      return acc;
    }
    const [key, value] = res;
    acc[key] = value;
    return acc;
  }, out as Record<K, S>);
};

/**
 * Work around `in` operator not narrowing type
 * https://github.com/microsoft/TypeScript/issues/21732
 */
export function has<K extends string | number | symbol, T>(
  key: K,
  obj: T
): obj is T & Record<K, unknown> {
  return obj && key in (obj as any);
}

/**
 * Array splice but it returns a new list instead of modifying the original one
 * and returning the removed items.
 *
 * @see Array.splice
 */
export const splice = <T>(
  list: readonly T[],
  ...args: Parameters<T[]['splice']>
) => {
  const newList = list.slice();
  newList.splice(...args);
  return newList;
};

/**
 * Helper for array filter that correctly narrows type
 * @example
 * .filter(notNullish)
 */
export const notNullish = <T>(item: T | null | undefined): item is T =>
  item != null;
