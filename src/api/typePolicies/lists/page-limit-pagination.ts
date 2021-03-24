import { Reference } from '@apollo/client';
import {
  FieldFunctionOptions,
  FieldPolicy,
} from '@apollo/client/cache/inmemory/policies';
import {
  isObject,
  last,
  orderBy,
  sortedIndexBy,
  sortedLastIndexBy,
  uniqBy,
  ValueIteratee,
} from 'lodash';
import { isListNotEmpty, Nullable } from '../../../util';
import {
  InputArg,
  PaginatedListInput,
  PaginatedListOutput,
  SortableListInput,
} from '../../list-caching';
import { sortingFromArgs } from '../../list-caching/util';
import { Order } from '../../schema.generated';
import { unwrapSecured } from '../../secured';

export type PaginatedListArgs = InputArg<PaginatedListInput>;

/**
 * Opinionated pagination handling for our API lists.
 * This works for all lists that fit the in/put shapes above.
 *
 * All args besides page & count are treated as separate lists.
 *
 * Each page of the list is merged together into a sparse array.
 * This should allow pages to be fetched out of order while maintaining sanity.
 * i.e. resuming a list in the middle.
 *
 * Careful using `hasMore` property with this. That indicates the end of the list
 * has been reached but not necessarily that all pages have been fetched.
 *
 * If you only want an individual page at a time,
 * the read field can be specified like so:
 * ```
 * fieldFoo: {
 *   ...pageLimitPagination(),
 *   read: (existing) => { custom logic },
 * }
 * ```
 */
export const pageLimitPagination = <
  T,
  List extends Partial<PaginatedListOutput<T>>
>(
  defaultSort?: SortableListInput
): FieldPolicy<List> => ({
  // The list is unique for all args except page & count
  keyArgs: (args: InputArg<PaginatedListInput> | null) => {
    const { count, page, ...rest } = args?.input ?? {};
    return objectToKeyArgs({ input: rest });
  },
  merge(existing, incoming, options: FieldFunctionOptions<PaginatedListArgs>) {
    const items = mergeList(
      // @ts-expect-error we've mistakenly typed lists as their type,
      // but in actuality they are a reference object (which points to their type).
      // Work could be done in future to type these as refs to T, and resolving to T.
      existing?.items,
      incoming.items,
      defaultSort,
      options
    );

    return {
      ...existing,
      ...incoming,
      items,
      // If we already believe to have finished paging, then keep that status
      // even though we've received another non-ending page somehow.
      hasMore: existing?.hasMore === false ? false : incoming.hasMore,
    };
  },
  // @ts-expect-error shhhh we are quietly going to make it accessible to addItemToList
  defaultSort,
});

const mergeList = (
  existing: Nullable<Reference[]>,
  incoming: Nullable<Reference[]>,
  defaultSort: SortableListInput | undefined,
  { args, readField }: FieldFunctionOptions<PaginatedListArgs>
): Reference[] => {
  // Only use incoming if nothing existed
  if (!isListNotEmpty(existing)) {
    return incoming ?? [];
  }
  // Keep existing if nothing incoming
  if (!isListNotEmpty(incoming)) {
    return existing;
  }

  const { sort, order } = sortingFromArgs(args, defaultSort);
  const byId = (ref: Reference) => readField('id', ref);
  const readSecuredField = (field: string) => (ref: Reference) => {
    const secured = readField(field, ref);
    const fieldVal = unwrapSecured(secured);
    return fieldVal;
  };

  let items: Reference[];
  if (sort && order) {
    // If we have sorting info, replace an entire page section based on this.
    // For example
    // Existing: [a, b, c, d, e, f]
    // Incoming:       [c,    e, f, g]
    // We can assume `d `has been deleted.

    const spliceLists = order === 'ASC' ? spliceAscLists : spliceDescLists;
    items = spliceLists(existing, incoming, readSecuredField(sort));
  } else {
    // If no sort/order provided, just append incoming and dedupe keeping last.
    items = [...existing, ...incoming];
  }

  // Ensure no duplicate items in list.
  // This could happen with when an item's prop which we are sorting/paging on changes
  // between page calls. Or if we add an item to the list locally that later
  // shows up from API. Or potentially if the sorting parameter is the same for
  // all page items (like createdAt for migrated items).
  // We assume forward iteration so the last item found is the correct placement.
  const uniqueItems = uniqLastBy(items, byId);

  if (sort && order && uniqueItems.length !== items.length) {
    // If we found duplicates, re-sort the list, because I'm not certain
    // we removed the right one(s).
    items = orderBy(
      uniqueItems,
      readSecuredField(sort),
      order.toLowerCase() as Lowercase<Order>
    );
  } else {
    items = uniqueItems;
  }

  return items;
};

// This assumes existing list is sorted ascending
const spliceAscLists = <T>(
  existing: T[],
  incoming: T[],
  iteratee: ValueIteratee<T>
): T[] => {
  // splice starting point is last occurrence of item.
  // list is unique by ID and sorted, but the sorting yield duplicates.
  // such as the same name or created time.
  const firstIdx = sortedLastIndexBy(existing, incoming[0]!, iteratee);
  // splice ending point is the first occurrence
  const lastIdx = sortedIndexBy(existing, last(incoming)!, iteratee);
  // start adding incoming after firstIdx,
  // remove any items between firstIdx and lastIdx (if <= 0 this is skipped),
  // finish incoming, and continue on with rest of existing list.
  return splice(existing, firstIdx, lastIdx - firstIdx, ...incoming);
};

// This assumes existing is sorted descending.
// lodash doesn't have this implementation so we have to fake it by reversing
// the lists before and after.
const spliceDescLists = <T>(
  existing: T[],
  incoming: T[],
  iteratee: ValueIteratee<T>
) => spliceAscLists(existing.reverse(), incoming.reverse(), iteratee).reverse();

// Array splice but it returns a new list instead of modifying the original one
// and returning the removed items
const splice = <T>(list: readonly T[], ...args: Parameters<T[]['splice']>) => {
  const newList = list.slice();
  newList.splice(...args);
  return newList;
};

// Same as uniqBy but it keeps the last item found, instead of the first.
const uniqLastBy = <T>(list: T[], iteratee: ValueIteratee<T>): T[] =>
  uniqBy(list.reverse(), iteratee).reverse();

// Converts an object to a list of Apollo key specifiers
const objectToKeyArgs = (obj: Record<string, any>): KeySpecifier =>
  Object.entries(obj).reduce(
    (keyArgs: KeySpecifier, [key, val]) => [
      ...keyArgs,
      key,
      ...(isObject(val) ? [objectToKeyArgs(val)] : []),
    ],
    []
  );

type KeySpecifier = Array<string | any[]>;
