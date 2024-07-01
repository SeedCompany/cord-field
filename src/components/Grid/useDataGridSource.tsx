import {
  type TypedDocumentNode as DocumentNode,
  useQuery,
} from '@apollo/client';
import {
  FilterColumnsArgs,
  GetColumnForNewFilterArgs,
  GridFilterItem,
  GridLogicOperator,
} from '@mui/x-data-grid';
import {
  DataGridProProps as DataGridProps,
  GridApiPro,
  GridFetchRowsParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';
import { Nil } from '@seedcompany/common';
import { useDebounceFn, useLatest, useMemoizedFn } from 'ahooks';
import {
  type FieldNode,
  getOperationAST,
  Kind,
  type SelectionSetNode,
} from 'graphql';
import { get, merge, pick, set, uniqBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import type { Get, Paths, SetNonNullable } from 'type-fest';
import {
  type PaginatedListInput,
  type PaginatedListOutput,
  type SortableListInput,
} from '~/api';
import type { Order } from '~/api/schema/schema.graphql';
import { lowerCase, upperCase } from '~/common';

type ListInput = SetNonNullable<
  Required<
    SortableListInput & PaginatedListInput & { filter?: Record<string, any> }
  >
>;

type PathsMatching<T, List> = {
  [K in Paths<T>]: K extends string
    ? Get<T, K> extends List
      ? K
      : never
    : never;
}[Paths<T>];

const defaultInitialInput = {
  count: 25,
  sort: 'id',
  order: 'ASC' as Order,
};
const defaultKeyArgs = ['__typename', 'id'];

export const useDataGridSource = <
  Output extends Record<string, any>,
  Vars,
  Input extends Partial<ListInput>,
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
  keyArgs = defaultKeyArgs,
}: {
  query: DocumentNode<Output, Vars>;
  variables: Vars & { input?: Input };
  listAt: Path;
  initialInput?: Partial<Omit<Input, 'page'>>;
  keyArgs?: string[];
}) => {
  const initialInputRef = useLatest(initialInput);
  const apiRef = useGridApiRef();

  const queryForItemRef = useMemo(() => {
    const queryForItemRef = structuredClone(query);
    const listNode = getFieldPath(
      getOperationAST(queryForItemRef)!.selectionSet,
      [...listAt.split('.'), 'items']
    );
    listNode.selections = keyArgs.map((field) => ({
      kind: Kind.FIELD,
      name: { kind: Kind.NAME, value: field },
    }));
    return queryForItemRef;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- these deps should not be changing between renders
  }, []);

  function listFrom(data: Output): List;
  function listFrom(data: Output | Nil): List | undefined;
  function listFrom(data: Output | Nil) {
    return data ? (get(data, listAt) as List) : undefined;
  }
  function cacheInfo(data: Output | Nil) {
    if (!data) {
      return undefined;
    }
    const list = listFrom(data);
    return {
      ...list,
      isComplete: list.total === list.items.length,
    };
  }

  // Try to pull the complete list from the cache
  // This exists after all pages have been queried with the useQuery hook below.
  // This allows us to do client-side filtering & sorting once we have the complete list.
  const { data: allPagesData, client } = useQuery(query, {
    variables,
    fetchPolicy: 'cache-only',
  });
  const allPages = cacheInfo(allPagesData);

  // Add a page to the "all pages" cache entry
  // This is read back in the first useQuery hook, above.
  const updateAllPagesQuery = (
    variables: Vars,
    next: Output,
    updateTotal: boolean
  ) => {
    client.cache.updateQuery(
      {
        query: queryForItemRef,
        variables,
      },
      (prev) => {
        const prevList = listFrom(prev);
        const nextList = listFrom(next);
        if (prevList && prevList.items.length === nextList.total) {
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
          total: ((updateTotal ? nextList : prevList) ?? nextList).total,
        });
        return nextCached;
      }
    );
  };

  // State for current sorting & filtering
  const [initialSort] = useState(() => [
    {
      field: initialInput?.sort ?? defaultInitialInput.sort,
      sort: lowerCase(initialInput?.order ?? defaultInitialInput.order),
    },
  ]);
  const [view, setView] = useState(
    (): Pick<DataGridProps, 'sortModel' | 'filterModel'> & {
      // The sorting state for the first page API query.
      // It could be the live sorting state, or a stale one,
      // based on pagination needs.
      apiSortModel: DataGridProps['sortModel'];
    } => ({
      filterModel: { items: [] },
      sortModel: initialSort,
      apiSortModel: initialSort,
    })
  );
  const viewRef = useLatest(view);
  const hasFilter = !!view.filterModel && view.filterModel.items.length > 0;

  // Convert the view state to the input for the GQL query
  const input = useMemo(
    () => ({
      ...defaultInitialInput,
      ...initialInputRef.current,
      count: initialInputRef.current?.count ?? defaultInitialInput.count,
      ...(view.apiSortModel?.[0] && {
        sort: view.apiSortModel[0].field,
        order: upperCase(view.apiSortModel[0].sort!),
      }),
      filter: convertMuiFiltersToApi(
        apiRef.current,
        view.filterModel,
        variables.input?.filter,
        initialInputRef.current?.filter
      ),
    }),
    [
      apiRef,
      initialInputRef,
      view.apiSortModel,
      view.filterModel,
      variables.input?.filter,
    ]
  );
  const variablesWithFilter = useMemo(() => {
    const { count, sort, order, ...rest } = input;
    return {
      ...variables,
      input: rest,
    };
  }, [variables, input]);

  const addToAllPagesCache = (next: Output) => {
    updateAllPagesQuery(variables, next, !hasFilter);
    if (hasFilter) {
      updateAllPagesQuery(variablesWithFilter, next, true);
    }
  };

  const { data: allFilteredPagesData } = useQuery(query, {
    variables: variablesWithFilter,
    fetchPolicy: 'cache-only',
    skip: !hasFilter,
  });
  const allFilteredPages = cacheInfo(allFilteredPagesData);

  const isCacheComplete =
    allPages?.isComplete || allFilteredPages?.isComplete || false;

  // Grab the first page from cache/network on mount and when view changes
  const { data: firstPage, loading } = useQuery(query, {
    skip: isCacheComplete,
    variables: useMemo(
      () => ({ ...variables, input: { ...input, page: 1 } }),
      [variables, input]
    ),
    onCompleted: addToAllPagesCache,
  });

  const list = loading
    ? { items: emptyList, total: undefined }
    : allPages?.isComplete
    ? allPages
    : allFilteredPages?.isComplete
    ? allFilteredPages
    : listFrom(firstPage);
  const rows = list?.items ?? emptyList;
  const total = list?.total;

  // Load additional pages imperatively as needed based on scrolling
  // This is debounced to mostly to reduce the client side load.
  // It is theoretical as well that some pages could be scrolled past,
  // and the debouncing would skip those page requests.
  const onFetchRows = useDebounceFn(
    (params: GridFetchRowsParams) => {
      if (isCacheComplete) {
        return;
      }

      const { firstRowToRender, lastRowToRender } = params;
      const firstPage = Math.ceil((firstRowToRender + 1) / input.count);
      const lastPage = Math.ceil((lastRowToRender + 1) / input.count);
      const pages = Array.from(
        { length: lastPage - firstPage + 1 },
        (_, i) => firstPage + i
      )
        // skip the first page always loaded first by useQuery hook
        .filter((page) => page > 1);

      for (const page of pages) {
        void client
          .query({
            query,
            variables: {
              ...variables,
              input: { ...input, page },
            },
          })
          .then((res) => {
            // Only apply to rows if the view hasn't changed
            const isCurrent =
              params.sortModel === viewRef.current.sortModel &&
              params.filterModel === viewRef.current.filterModel;
            if (isCurrent) {
              // Swap in real rows via the recommended process.
              const firstRowToReplace = (page - 1) * input.count;
              const list = listFrom(res.data).items.slice();
              apiRef.current.unstable_replaceRows(firstRowToReplace, list);
            }

            // Always try to complete the list in cache.
            addToAllPagesCache(res.data);
          });
      }
    },
    {
      wait: 500,
    }
  );

  const onSortModelChange: DataGridProps['onSortModelChange'] & {} =
    useMemoizedFn((next) => {
      const sortModel = next.length === 0 ? initialSort : next;
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
      setView((prev) => ({
        ...prev,
        filterModel,
        // API should now use the current sorting state
        apiSortModel: prev.sortModel,
      }));

      apiRef.current.scrollToIndexes({ rowIndex: 0 });
    });

  // DataGrid needs help when `rows` identity changes along with picking up
  // sorting responsibility ('client').
  // Help it out by asking it to sort (again?) when we give it a different,
  // fully cached, unsorted list.
  useEffect(() => {
    if (isCacheComplete) {
      apiRef.current.applySorting();
    }
  }, [apiRef, isCacheComplete]);

  const dataGridProps = {
    apiRef,
    rows,
    loading,
    rowCount: total,
    sortModel: view.sortModel,
    filterModel: view.filterModel,
    hideFooterPagination: true,
    onFetchRows: onFetchRows.run,
    onSortModelChange,
    onFilterModelChange,
    paginationMode: total != null ? 'server' : 'client', // Not used, but prevents row count warning.
    rowsLoadingMode: isCacheComplete ? 'client' : 'server',
    sortingMode: isCacheComplete ? 'client' : 'server',
    filterMode: isCacheComplete ? 'client' : 'server',
    slotProps: apiSlotProps,
  } satisfies Partial<DataGridProps>;

  return [dataGridProps] as const;
};

const emptyList = [] as const;

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

const convertMuiFiltersToApi = (
  api: GridApiPro,
  next: DataGridProps['filterModel'],
  ...external: Array<Record<string, any> | undefined>
) => {
  if (!next) {
    return undefined;
  }
  const parts = next.items.map((item) => {
    const col = api.getColumn(item.field);
    return item.value == null
      ? null
      : col.serverFilter
      ? col.serverFilter(item)
      : set({}, item.field, item.value);
  });
  const filter = merge({}, ...parts, external);
  return Object.keys(filter).length > 0 ? filter : undefined;
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

const apiSlotProps = {
  filterPanel: {
    logicOperators: [GridLogicOperator.And],
    filterFormProps: {
      filterColumns,
    },
    getColumnForNewFilter,
  },
} satisfies DataGridProps['slotProps'];

declare module '@mui/x-data-grid/internals' {
  interface GridBaseColDef {
    /**
     * Customize how GridFilterItem converts to the filter object for API.
     * By default, the field name becomes the path key of the object.
     */
    serverFilter?: (item: GridFilterItem) => Record<string, any>;
  }
}
