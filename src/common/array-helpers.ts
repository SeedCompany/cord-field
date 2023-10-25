import { Nil } from '@seedcompany/common';
import { fill, times } from 'lodash';

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
