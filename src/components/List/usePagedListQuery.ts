import { useQuery } from '@apollo/client';
import { QueryHookOptions } from '@apollo/client/react/types/types';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { uniqBy } from 'lodash';
import { useMemo, useRef, useState } from 'react';
import { InputArg, PaginatedListInput, PaginatedListOutput } from '../../api';
import { ListQueryResult } from './useListQuery';

type Options<
  Data,
  Variables extends InputArg<PaginatedListInput>,
  List extends PaginatedListOutput<Item>,
  Item
> = QueryHookOptions<Data, Variables> & {
  /** Where in the query result is the list? */
  listAt: (data: Data) => List;
};

interface Accumulated<Item> {
  /** Identifies the base query variables; accumulation resets when they change. */
  key: string;
  pages: ReadonlyArray<readonly Item[]>;
  page: number;
  hasMore?: boolean;
  total?: number;
}

/**
 * Page-based list query that accumulates pages in React state rather than relying
 * on an Apollo field `merge` policy. Needed for the data-grid–backed list fields
 * (`projects`, `partners`, `users`, `languages`, `engagements`), which intentionally
 * have no merge policy (the grid manages their cache itself), so the normal
 * {@link useListQuery} "Load More" — which depends on that policy — never appends.
 */
export const usePagedListQuery = <
  Data,
  Variables extends InputArg<PaginatedListInput>,
  Item extends { id: string },
  List extends PaginatedListOutput<Item>
>(
  doc: TypedDocumentNode<Data, Variables>,
  options: Options<Data, Variables, List, Item>
): ListQueryResult<Item, List, Data> => {
  const { listAt, ...opts } = options;
  const result = useQuery(doc, {
    ...opts,
    notifyOnNetworkStatusChange: true,
  });
  const { fetchMore } = result;
  // Keep the previous results visible while a new variable set (e.g. a changed
  // sort or filter) is in flight, instead of flashing skeletons. The list simply
  // re-orders/updates once the new data lands.
  const res = result.data ?? result.previousData;

  const key = JSON.stringify(options.variables ?? {});
  const [acc, setAcc] = useState<Accumulated<Item>>({
    key,
    pages: [],
    page: 1,
  });
  // Ignore (and effectively reset) accumulation when the base variables change.
  const active: Accumulated<Item> = useMemo(
    () => (acc.key === key ? acc : { key, pages: [], page: 1 }),
    [acc, key]
  );

  const firstList = res ? listAt(res) : undefined;

  const data = useMemo(() => {
    if (!firstList) {
      return undefined;
    }
    const loadedExtra = active.pages.length > 0;
    const items = uniqBy(
      [...firstList.items, ...active.pages.flat()],
      (item) => item.id
    );
    return {
      ...firstList,
      items,
      hasMore: loadedExtra ? !!active.hasMore : firstList.hasMore,
      total: loadedExtra ? active.total ?? firstList.total : firstList.total,
    };
  }, [firstList, active]);

  // Guards against concurrent "Load More" requests for the same page — a fast
  // double-tap would otherwise fetch the next page twice (uniqBy only hides the
  // duplicate rows, not the wasted request).
  const loadingMoreRef = useRef(false);
  const loadMore = () => {
    if (!firstList || loadingMoreRef.current) {
      return;
    }
    loadingMoreRef.current = true;
    const nextPage = active.page + 1;
    void fetchMore({
      variables: {
        ...options.variables,
        input: { ...options.variables?.input, page: nextPage },
      },
      // We accumulate from the resolved result below; keep the watched query as-is
      // (and avoid Apollo's missing-merge warning for these un-merged fields).
      updateQuery: (prev) => prev,
    })
      .then(({ data: more }) => {
        const moreList = listAt(more);
        setAcc((curr) => {
          const base =
            curr.key === key
              ? curr
              : {
                  key,
                  pages: [],
                  page: 1,
                  hasMore: undefined,
                  total: undefined,
                };
          return {
            key,
            pages: [...base.pages, moreList.items],
            page: nextPage,
            hasMore: moreList.hasMore,
            total: moreList.total,
          };
        });
      })
      .finally(() => {
        loadingMoreRef.current = false;
      });
  };

  return {
    loading: result.loading,
    data: data as List | undefined,
    error: result.error,
    networkStatus: result.networkStatus,
    loadMore,
    root: res,
  };
};
