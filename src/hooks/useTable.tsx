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
import { useDebounceFn, useLatest } from 'ahooks';
import {
  type FieldNode,
  getOperationAST,
  Kind,
  type SelectionSetNode,
} from 'graphql';
import { get, merge, pick, set, uniqBy } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import type { Get, Paths, SetNonNullable } from 'type-fest';
import {
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
  count: 25,
  sort: 'id',
  order: 'ASC' as Order,
};
const defaultKeyArgs = ['__typename', 'id'];

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
  keyArgs = defaultKeyArgs,
}: {
  query: DocumentNode<Output, Vars>;
  variables: Vars;
  listAt: Path;
  initialInput?: Partial<Omit<ListInput, 'page'>>;
  keyArgs?: string[];
}) => {
  const initialInputRef = useLatest(initialInput);
  const apiRef = useGridApiRef();
  const api: GridApiPro = apiRef.current;

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

  // Try to pull the complete list from the cache
  // This exists after all pages have been queried with the useQuery hook below.
  // This allows us to do client-side filtering & sorting once we have the complete list.
  const { data: allPages, client } = useQuery(query, {
    variables,
    fetchPolicy: 'cache-only',
  });
  const allPagesList = allPages ? (get(allPages, listAt) as List) : undefined;
  const isCacheComplete =
    allPagesList && allPagesList.total === allPagesList.items.length;

  // Add a page to the "all pages" cache entry
  // This is read back in the first useQuery hook, above.
  const addToAllPagesCache = (next: Output) => {
    client.cache.updateQuery(
      {
        query: queryForItemRef,
        variables,
      },
      (prev) => {
        const prevList = prev ? (get(prev, listAt) as List) : undefined;
        const nextList = get(next, listAt) as List;
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
        set(nextCached, listAt, { ...nextList, items: mergedList });
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
    (): Pick<DataGridProps, 'sortModel' | 'filterModel'> => ({
      filterModel: { items: [] },
      sortModel: initialSort,
    })
  );
  const viewRef = useLatest(view);

  // Convert the view state to the input for the GQL query
  const input = useMemo(
    () => ({
      ...defaultInitialInput,
      ...initialInputRef.current,
      ...(view.sortModel?.[0] && {
        sort: view.sortModel[0].field,
        order: upperCase(view.sortModel[0].sort!),
      }),
      filter: convertMuiFiltersToApi(view.filterModel, api),
    }),
    [api, initialInputRef, view]
  );

  // Grab the first page from cache/network on mount and when view changes
  const { data: firstPage, loading } = useQuery(query, {
    skip: isCacheComplete,
    variables: useMemo(
      () => ({ ...variables, input: { ...input, page: 1 } }),
      [variables, input]
    ),
    onCompleted: addToAllPagesCache,
  });
  const firstPageList = firstPage
    ? (get(firstPage, listAt) as List)
    : undefined;

  const list = isCacheComplete ? allPagesList : firstPageList;
  const total = allPagesList?.total ?? firstPageList?.total ?? 0;

  // Load additional pages imperatively as needed based on scrolling
  // This is debounced to mostly to reduce the client side load.
  // It is theoretical as well that some pages could be scrolled past,
  // and the debouncing would skip those page requests.
  const onFetchRows = useDebounceFn(
    (params: GridFetchRowsParams) => {
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
              const list = (get(res.data, listAt) as List).items.slice();
              api.unstable_replaceRows(firstRowToReplace, list);
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
    useCallback(
      (sortModel) =>
        setView((prev) => ({
          ...prev,
          sortModel: sortModel.length === 0 ? initialSort : sortModel,
        })),
      [initialSort, setView]
    );
  const onFilterModelChange: DataGridProps['onFilterModelChange'] & {} =
    useCallback(
      (filterModel) => setView((prev) => ({ ...prev, filterModel })),
      [setView]
    );

  const dataGridProps = {
    apiRef,
    rows: list?.items ?? [],
    loading,
    rowCount: total,
    ...view,
    hideFooterPagination: true,
    onFetchRows: onFetchRows.run,
    onSortModelChange,
    onFilterModelChange,
    rowsLoadingMode: isCacheComplete ? 'client' : 'server',
    sortingMode: isCacheComplete ? 'client' : 'server',
    filterMode: isCacheComplete ? 'client' : 'server',
    slotProps: apiSlotProps,
  } satisfies Partial<DataGridProps>;

  const props = {
    isCacheComplete,
    total,
    list,
  };

  return [dataGridProps, props] as const;
};

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
  next: DataGridProps['filterModel'],
  api: GridApiPro
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
  const filter = merge({}, ...parts);
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
