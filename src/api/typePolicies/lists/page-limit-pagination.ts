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
    // This function is called a lot and most of the time there are no args.
    // Optimization for this case.
    if (!args || !args.input) {
      // @ts-expect-error false is fine as a key specifier but Apollo types
      // incorrectly say that it's not ok when using a function.
      return false as KeySpecifier;
    }
    const { count, page, ...rest } = args.input;
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

    let nextPage = (options.args?.input?.page ?? 1) + 1;
    let hasMore = incoming.hasMore;

    if (
      incoming.hasMore === false &&
      incoming.total &&
      items.length < incoming.total
    ) {
      // If we've finished paging but our total is less then we missed some,
      // probably new items. Reset to beginning to try to load them.
      nextPage = 1;
      hasMore = true;
    }

    return {
      ...existing,
      ...incoming,
      items,
      hasMore,
      nextPage,
    };
  },
  // @ts-expect-error shhhh we are quietly going to make it accessible to addItemToList
  defaultSort,
});

const mergeList = (
  existing: Nullable<readonly Reference[]>,
  incoming: Nullable<readonly Reference[]>,
  defaultSort: SortableListInput | undefined,
  { args, readField }: FieldFunctionOptions<PaginatedListArgs>
): readonly Reference[] => {
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

  let items: readonly Reference[];
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
  existing: readonly T[],
  incoming: readonly T[],
  iteratee: ValueIteratee<T>
): readonly T[] => {
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
  existing: readonly T[],
  incoming: readonly T[],
  iteratee: ValueIteratee<T>
) => reverse(spliceAscLists(reverse(existing), reverse(incoming), iteratee));

// Array splice but it returns a new list instead of modifying the original one
// and returning the removed items
const splice = <T>(list: readonly T[], ...args: Parameters<T[]['splice']>) => {
  const newList = list.slice();
  newList.splice(...args);
  return newList;
};

// Same as uniqBy but it keeps the last item found, instead of the first.
const uniqLastBy = <T>(
  list: readonly T[],
  iteratee: ValueIteratee<T>
): readonly T[] => reverse(uniqBy(reverse(list), iteratee));

// Array.reverse but it returns a new array instead of modifying the input
const reverse = <T>(list: readonly T[]): readonly T[] => list.slice().reverse();

// Converts an object to a list of Apollo key specifiers
// Empty objects are assumed to be the same as omission and therefore
// left out of the key specifier
const objectToKeyArgs = (obj: Record<string, any>): KeySpecifier => {
  const keys = objectToKeyArgsRecurse(cleanEmptyObjects(obj));
  // @ts-expect-error false is fine as a key specifier but Apollo types
  // incorrectly say that it's not ok when using a function.
  return keys.length > 1 ? keys : false;
};
const objectToKeyArgsRecurse = (obj: Record<string, any>): KeySpecifier =>
  Object.entries(obj).reduce(
    (keyArgs: KeySpecifier, [key, val]) => [
      ...keyArgs,
      key,
      ...(isObject(val) ? [objectToKeyArgsRecurse(val)] : []),
    ],
    []
  );

const cleanEmptyObjects = (obj: Record<string, any>): Record<string, any> => {
  const res: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!isObject(value)) {
      res[key] = value;
      continue;
    }
    // eslint-disable-next-line @seedcompany/no-unused-vars -- no why idea the false positive here
    const cleanedSub = cleanEmptyObjects(value);
    if (Object.keys(cleanedSub).length === 0) {
      continue;
    }
    res[key] = cleanedSub;
  }
  return res;
};

type KeySpecifier = Array<string | any[]>;
