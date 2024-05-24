import {
  type TypedDocumentNode as DocumentNode,
  useQuery,
} from '@apollo/client';
import type { DataGridProps } from '@mui/x-data-grid';
import { get, set, uniqBy } from 'lodash';
import { useState } from 'react';
import type { Get, Paths, SetNonNullable } from 'type-fest';
import {
  isNetworkRequestInFlight,
  type PaginatedListInput,
  type PaginatedListOutput,
  type SortableListInput,
} from '~/api';
import type { Order } from '~/api/schema/schema.graphql';
import { lowerCase, upperCase } from '~/common';

type ListInput = SetNonNullable<
  Required<SortableListInput & PaginatedListInput>
>;

type PathsMatching<T, List> = {
  [K in Paths<T>]: K extends string
    ? Get<T, K> extends List
      ? K
      : never
    : never;
}[Paths<T>];

const defaultInitialInput = {
  page: 1,
  count: 25,
  sort: 'id',
  order: 'ASC' as Order,
};

export const useTable = <
  Output extends Record<string, any>,
  Vars extends { input?: ListInput; [s: string]: any },
  const Path extends PathsMatching<Output, PaginatedListOutput<any>> & string,
  List extends PaginatedListOutput<any> = Get<Output, Path> extends infer U
    ? U extends PaginatedListOutput<any>
      ? U
      : never
    : never
>({
  query,
  variables,
  listAt,
  initialInput,
}: {
  query: DocumentNode<Output, Vars>;
  variables: Vars;
  listAt: Path;
  initialInput?: Partial<ListInput>;
}) => {
  const [input, onChange] = useState(() => ({
    ...defaultInitialInput,
    ...initialInput,
  }));

  // Try to pull the complete list from the cache
  // This exists after all pages have been queried with the useQuery hook below.
  // This allows us to do client-side filtering & sorting once we have the complete list.
  const { data: allPages } = useQuery(query, {
    variables,
    fetchPolicy: 'cache-only',
  });
  const allPagesList = allPages ? (get(allPages, listAt) as List) : undefined;
  const isCacheComplete =
    allPagesList && allPagesList.total === allPagesList.items.length;

  // Go to network when needed to fetch individual pages with server side filtering & sorting.
  const {
    data: currentPage,
    networkStatus,
    client,
  } = useQuery(query, {
    skip: isCacheComplete,
    variables: { ...variables, input },
    notifyOnNetworkStatusChange: true,
    onCompleted: (next) => {
      // Add this page to the "all pages" cache entry
      // This is read back in the first useQuery hook, above.
      client.cache.updateQuery(
        {
          query,
          variables,
        },
        (prev) => {
          const prevList = prev ? (get(prev, listAt) as List) : undefined;
          const nextList = get(next, listAt) as List;
          if (prevList && prevList.items.length === nextList.total) {
            return undefined; // no change
          }
          const mergedList = uniqBy(
            [...(prevList?.items ?? []), ...nextList.items],
            (item) => client.cache.identify(item)
          );
          const nextCached = structuredClone(next);
          set(nextCached, listAt, { ...nextList, items: mergedList });
          return nextCached;
        }
      );
    },
  });
  const currentPageList = currentPage
    ? (get(currentPage, listAt) as List)
    : undefined;

  const list = isCacheComplete ? allPagesList : currentPageList;
  const total = allPagesList?.total ?? currentPageList?.total ?? 0;

  const dataGridProps = {
    rows: list?.items ?? [],
    rowCount: total,
    loading: isNetworkRequestInFlight(networkStatus),
    page: input.page - 1,
    sortModel: [{ field: input.sort, sort: lowerCase(input.order) }],
    onPageChange: (next) => {
      onChange((prev) => ({ ...prev, page: next + 1 }));
    },
    onSortModelChange: ([next]) => {
      onChange((prev) => ({
        ...prev,
        sort: next!.field,
        order: upperCase(next!.sort!),
        page: 1,
      }));
    },
    pageSize: input.count,
    rowsPerPageOptions: [input.count],
    sortingOrder: ['desc', 'asc'], // no unsorted
    paginationMode: isCacheComplete ? 'client' : 'server',
    sortingMode: isCacheComplete ? 'client' : 'server',
  } satisfies Partial<DataGridProps>;

  const props = {
    isCacheComplete,
    total,
    list,
  };

  return [dataGridProps, props] as const;
};
