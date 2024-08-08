import { Nil } from '@seedcompany/common';
import { fill, keys, times } from 'lodash';

export const isListNotEmpty = <T>(
  list: readonly T[] | Nil
): list is readonly T[] & { 0: T } => !!list && list.length > 0;

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
 * Helper for object to get the first value (treating it as an array)
 * @param obj - The object to get the first value from
 * @returns The first value or undefined if the object is empty
 * @example
 * const first = firstValue({ a: 1, b: 2 }) // 1
 */
export const firstValue = <V>(obj: Record<string, V>) => obj[keys(obj)[0]!];
