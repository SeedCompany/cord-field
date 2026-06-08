import {
  type TypedDocumentNode as DocumentNode,
  MaybeMasked,
  Unmasked,
  useQuery,
} from '@apollo/client';
import {
  FilterColumnsArgs,
  GetColumnForNewFilterArgs,
  GridLogicOperator,
  GridSlotProps,
} from '@mui/x-data-grid';
import {
  DataGridProProps as DataGridProps,
  GridApiPro,
  GridFetchRowsParams,
  GridOverlay,
  useGridApiContext,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { groupBy, Nil } from '@seedcompany/common';
import { useDebounceFn, useMemoizedFn, useTimeout } from 'ahooks';
import {
  type FieldNode,
  getOperationAST,
  Kind,
  OperationDefinitionNode,
  type SelectionSetNode,
} from 'graphql';
import { get, merge, pick, set, uniqBy } from 'lodash';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import type { Get, Paths } from 'type-fest';
import { useGridFilteredRowCount } from './useGridFilteredRowCount';
import { ListInput, useViewState, ViewState } from './useViewState';

interface PaginatedListOutput<T> {
  items: readonly T[];
  total: number;
}

type PathsMatching<T, List> = {
  [K in Paths<T>]: K extends string
    ? Get<T, K> extends List
      ? K
      : never
    : never;
}[Paths<T>];

const defaultKeyArgs = ['__typename', 'id'];

// The built-in NoInfer<T> (TS 5.4+) is an intrinsic that TypeScript doesn't
// resolve through when accessing properties on constrained generics.
// This identity-type variant works correctly in that context.
type NoInfer<T> = [T][T extends any ? 0 : never];

const emptyList = [] as const;

// ─── useCachedList ──────────────────────────────────────────────────────────
// Manages all Apollo cache accumulation, page fetching, and row stability.
// Returns stable rows/total and an imperative onFetchRows for virtual scrolling.

function useCachedList<
  Output extends Record<string, any>,
  Vars extends Record<string, any>
>({
  query,
  variables,
  variablesWithFilter,
  listAt,
  keyArgs,
  hasFilter,
  input,
  viewRef,
  apiRef,
}: {
  query: DocumentNode<Output, Vars>;
  variables: Vars;
  variablesWithFilter: Vars;
  listAt: string;
  keyArgs: string[];
  hasFilter: boolean;
  input: { count: number } & Record<string, any>;
  viewRef: MutableRefObject<ViewState>;
  apiRef: MutableRefObject<GridApiPro>;
}) {
  // Helper: extract the list from a query result
  function listFrom(
    data: Unmasked<Output> | MaybeMasked<Output>
  ): PaginatedListOutput<any>;
  function listFrom(
    data: Unmasked<Output> | MaybeMasked<Output> | Nil
  ): PaginatedListOutput<any> | undefined;
  function listFrom(data: Unmasked<Output> | MaybeMasked<Output> | Nil) {
    return data ? (get(data, listAt) as PaginatedListOutput<any>) : undefined;
  }
  function cacheInfo(data: MaybeMasked<Output> | Nil) {
    if (!data) return undefined;
    const list = listFrom(data);
    return { ...list, isComplete: list.total === list.items.length };
  }

  // Computed once: strip the query down to only keyArgs fields so the
  // cache-accumulation entries written by updateAllPagesQuery stay small.
  const queryForItemRef = useRef(
    (() => {
      const q = structuredClone(query);
      const listNode = getFieldPath(getOperationAST(q)!.selectionSet, [
        ...listAt.split('.'),
        'items',
      ]);
      listNode.selections = keyArgs.map((field) => ({
        kind: Kind.FIELD,
        name: { kind: Kind.NAME, value: field },
      }));
      return q;
    })()
  );

  // Two cache-only queries accumulate all pages without hitting the network.
  // See: docs/data-grid-source.md#the-two-cache-queries
  const { data: allPagesData, client } = useQuery(query, {
    variables,
    fetchPolicy: 'cache-only',
  });
  const allPages = cacheInfo(allPagesData);

  // Add a page to the "all pages" cache entry
  const updateAllPagesQuery = (
    vars: Vars,
    next: Unmasked<Output>,
    updateTotal: boolean
  ) => {
    client.cache.updateQuery(
      { query: queryForItemRef.current, variables: vars },
      (prev) => {
        const prevList = listFrom(prev);
        const nextList = listFrom(next);
        if (
          prevList &&
          prevList.items.length === nextList.total &&
          updateTotal &&
          prevList.total === nextList.total
        ) {
          return undefined; // no change
        }
        const mergedList = uniqBy(
          [
            ...(prevList?.items ?? []),
            ...nextList.items.map((item) => pick(item, keyArgs)),
          ],
          (item) => client.cache.identify(item)
        );
        const nextCached = structuredClone(next);
        set(nextCached, listAt, {
          ...nextList,
          items: mergedList,
          total: (updateTotal ? nextList : prevList)?.total ?? -1,
        });
        return nextCached;
      }
    );
  };

  const addToAllPagesCache = useMemoizedFn((next: MaybeMasked<Output>) => {
    updateAllPagesQuery(variables, next as Unmasked<Output>, !hasFilter);
    if (hasFilter) {
      updateAllPagesQuery(variablesWithFilter, next as Unmasked<Output>, true);
    }
  });

  const { data: allFilteredPagesData } = useQuery(query, {
    variables: variablesWithFilter,
    fetchPolicy: 'cache-only',
    skip: !hasFilter,
  });
  const allFilteredPages = cacheInfo(allFilteredPagesData);

  // See: docs/data-grid-source.md#iscachecomplete
  const isCacheComplete =
    allPages?.isComplete || allFilteredPages?.isComplete || false;

  // Grab the first page from cache/network on mount and when view changes
  const {
    data: firstPage,
    loading,
    previousData: prevFirstPage,
  } = useQuery(query, {
    skip: isCacheComplete,
    variables: useMemo(
      () => merge({}, variables, { input: { ...input, page: 1 } }),
      [variables, input]
    ),
  });
  useEffect(() => {
    firstPage && addToAllPagesCache(firstPage);
  }, [firstPage, addToAllPagesCache]);

  const freshList = loading
    ? undefined
    : allPages?.isComplete
    ? allPages
    : allFilteredPages?.isComplete
    ? allFilteredPages
    : listFrom(firstPage);

  // While loading (filter change, sort change, etc.) fall back to the most
  // recently known list so the grid stays populated instead of going blank.
  // prevFirstPage covers the normal Apollo refetch case; prevListRef covers
  // the skip→active transition where prevFirstPage is unavailable (e.g.
  // switching from a fully-cached filter to an uncached one).
  // See: docs/data-grid-source.md#row-stability-preventing-blank-flashes
  const prevListRef = useRef<typeof freshList>(undefined);
  const list = freshList ??
    listFrom(prevFirstPage) ??
    (loading ? prevListRef.current : undefined) ?? {
      items: emptyList,
      total: undefined,
    };
  if (freshList != null) prevListRef.current = freshList;

  const rows = list.items;
  const total = list.total && list.total >= 0 ? list.total : undefined;

  // Load additional pages imperatively as needed based on scrolling.
  // Debounced to reduce client-side load and skip fast-scrolled pages.
  const onFetchRows = useDebounceFn(
    (params: GridFetchRowsParams) => {
      if (isCacheComplete) return;

      const { firstRowToRender, lastRowToRender } = params;
      const startPage = Math.ceil((firstRowToRender + 1) / input.count);
      const endPage = Math.ceil((lastRowToRender + 1) / input.count);
      const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      )
        // skip the first page always loaded by useQuery above
        .filter((page) => page > 1);

      for (const page of pages) {
        void client
          .query({
            query,
            variables: {
              ...merge({}, variables, { input: { ...input, page } }),
            },
          })
          .then((res) => {
            // Only apply to rows if the view hasn't changed since the request
            // was fired — stale pages are discarded but still cached.
            // See: docs/data-grid-source.md#virtual-scroll-fetching
            const isCurrent =
              params.sortModel === viewRef.current.sortModel &&
              params.filterModel === viewRef.current.filterModel;
            if (isCurrent) {
              const firstRowToReplace = (page - 1) * input.count;
              const list = listFrom(res.data).items.slice();
              apiRef.current.unstable_replaceRows(firstRowToReplace, list);
            }
            // Always try to complete the list in cache.
            addToAllPagesCache(res.data);
          });
      }
    },
    { wait: 500 }
  );

  // Imperatively push a row into the DataGrid so the visible list updates
  // immediately. The Apollo cache update is the caller's responsibility
  // (typically via addItemToList in the mutation's update callback) — that
  // keeps the cache correct for future reads. This sidesteps the prop-vs-
  // internal row state drift caused by unstable_replaceRows during paged
  // loads, where cache reactivity alone doesn't reach the grid.
  const addRow = useMemoizedFn((item: { id: string }) => {
    apiRef.current.updateRows([item]);
  });

  return { rows, total, loading, isCacheComplete, onFetchRows, addRow };
}

// ─── useDataGridSource ───────────────────────────────────────────────────────

export const useDataGridSource = <
  Output extends Record<string, any>,
  Vars,
  Input extends Partial<ListInput>,
  const Path extends PathsMatching<Output, PaginatedListOutput<any>> & string
>({
  query,
  variables,
  listAt,
  initialInput,
  keyArgs = defaultKeyArgs,
  apiRef: apiRefInput,
}: {
  query: DocumentNode<Output, Vars>;
  variables: NoInfer<Vars & { input?: Input }>;
  listAt: Path;
  initialInput?: Partial<Omit<NoInfer<Input>, 'page'>>;
  keyArgs?: string[];
  apiRef?: MutableRefObject<GridApiPro>;
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks -- we'll assume this doesn't change between renders
  const apiRef = apiRefInput ?? useGridApiRef();
  const filteredRowCount = useGridFilteredRowCount(apiRef);

  const opName = useMemo(
    () =>
      query.definitions.find(
        (d): d is OperationDefinitionNode => d.kind === 'OperationDefinition'
      )!.name!.value,
    [query]
  );

  const {
    view,
    setView,
    viewRef,
    hasFilter,
    input,
    variablesWithFilter,
    initialSort,
  } = useViewState({ opName, initialInput, apiRef, variables });

  const { rows, total, loading, isCacheComplete, onFetchRows, addRow } =
    useCachedList({
      query,
      variables,
      variablesWithFilter,
      listAt,
      keyArgs,
      hasFilter,
      input,
      viewRef,
      apiRef,
    });

  const onSortModelChange: DataGridProps['onSortModelChange'] & {} =
    useMemoizedFn((next) => {
      let sortModel: ViewState['sortModel'];
      if (next.length > 0) {
        sortModel = [next[0]!];
      } else {
        // If "un-sorting" revert to initial sort
        sortModel = initialSort;
        // If the prev sort field _is_ the initial sort field, be sure to flip order
        const prev = view.sortModel[0];
        if (prev.field === initialSort[0].field) {
          sortModel[0].sort = prev.sort === 'asc' ? 'desc' : 'asc';
        }
      }

      setView((prev) => ({
        ...prev,
        sortModel,
        // API should use the new sorting state if pagination is still required.
        // Otherwise, if pagination has been exhausted / is not needed,
        // maintain the previously loaded first page and sort client side.
        ...(!isCacheComplete ? { apiSortModel: sortModel } : {}),
      }));

      apiRef.current.scrollToIndexes({ rowIndex: 0 });
    });

  const onFilterModelChange: DataGridProps['onFilterModelChange'] & {} =
    useMemoizedFn((filterModel) => {
      const next = {
        ...filterModel,
        // Take the last filter for each column
        items: groupBy(filterModel.items, (item) => item.field).map(
          (items) => items.at(-1)!
        ),
      };

      setView((prev) => ({
        ...prev,
        filterModel: next,
        // API should now use the current sorting state
        apiSortModel: prev.sortModel,
      }));

      apiRef.current.scrollToIndexes({ rowIndex: 0 });
    });

  // DataGrid needs help when `rows` identity changes along with picking up
  // sorting responsibility ('client').
  // Help it out by asking it to sort (again?) when we give it a different,
  // fully cached, unsorted list.
  // See: docs/data-grid-source.md#applying-client-side-sort-after-cache-completion
  useEffect(() => {
    if (isCacheComplete) {
      apiRef.current.applySorting();
    }
  }, [apiRef, isCacheComplete]);

  const mode = isCacheComplete ? 'client' : 'server';

  const dataGridProps = {
    apiRef,
    rows,
    loading,
    // See: docs/data-grid-source.md#row-count
    rowCount: isCacheComplete ? filteredRowCount ?? rows.length : total,
    sortModel: view.sortModel,
    filterModel: view.filterModel,
    hideFooterPagination: true,
    onFetchRows: onFetchRows.run,
    onSortModelChange,
    onFilterModelChange,
    // Not used for pagination; fixed to avoid MUI warning. Intentionally NOT
    // switched on isCacheComplete — doing so causes an internal DataGrid reset.
    // See: docs/data-grid-source.md#mode-switching
    paginationMode: total != null ? 'server' : 'client',
    rowsLoadingMode: mode,
    sortingMode: mode,
    filterMode: mode,
    slots: apiSlots,
    slotProps: apiSlotProps,
  } satisfies Partial<DataGridProps>;

  return [dataGridProps, { addRow }] as const;
};

// ─── Utilities ───────────────────────────────────────────────────────────────

const getFieldPath = (
  x: SelectionSetNode,
  path: ReadonlyArray<string | number>
) => {
  let current = x;
  for (const field of path) {
    // only for types
    if (typeof field === 'number') {
      continue;
    }
    const selection = current.selections.find(
      (s): s is FieldNode =>
        s.kind === 'Field' &&
        (s.alias?.value === field || s.name.value === field)
    );
    if (!selection?.selectionSet) {
      throw new Error(
        'Field path does not result in a selection set: ' + path.join('.')
      );
    }
    current = selection.selectionSet;
  }
  return current;
};

// Copied from MUI docs
const filterColumns = ({
  field,
  columns,
  currentFilters,
}: FilterColumnsArgs) => {
  // remove already filtered fields from list of columns
  const filteredFields = currentFilters.map((item) => item.field);
  return columns
    .filter(
      (colDef) =>
        colDef.filterable &&
        !colDef.hidden &&
        (colDef.field === field || !filteredFields.includes(colDef.field))
    )
    .map((column) => column.field);
};

// Copied from MUI docs
const getColumnForNewFilter = ({
  currentFilters,
  columns,
}: GetColumnForNewFilterArgs) => {
  const filteredFields = currentFilters.map(({ field }) => field);
  const columnForNewFilter = columns
    .filter(
      (colDef) => colDef.filterable && !filteredFields.includes(colDef.field)
    )
    .find((colDef) => colDef.filterOperators?.length);
  return columnForNewFilter?.field ?? null;
};

/**
 * Slightly delay showing no results.
 * Which prevents the flash of text when swapping between cached filters.
 * Since Apollo doesn't give loading=true when cached, so this is rendered
 * while "visible rows" is zero.
 * Which only happens for a few ms.
 */
const DelayNoResultsOverlay = (props: GridSlotProps['noResultsOverlay']) => {
  const [show, setShow] = useState(false);
  useTimeout(() => setShow(true), 10);
  const apiRef = useGridApiContext();
  return !show ? null : (
    <GridOverlay {...props}>
      {apiRef.current.getLocaleText('noResultsOverlayLabel')}
    </GridOverlay>
  );
};

const apiSlots = {
  noResultsOverlay: DelayNoResultsOverlay,
} satisfies DataGridProps['slots'];

const apiSlotProps = {
  filterPanel: {
    logicOperators: [GridLogicOperator.And],
    filterFormProps: {
      filterColumns,
    },
    getColumnForNewFilter,
  },
} satisfies DataGridProps['slotProps'];
