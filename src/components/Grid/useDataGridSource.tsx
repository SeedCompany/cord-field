import {
  type TypedDocumentNode as DocumentNode,
  useQuery,
} from '@apollo/client';
import {
  FilterColumnsArgs,
  GetColumnForNewFilterArgs,
  GridColType,
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
import { groupBy, Nil, setOf } from '@seedcompany/common';
import {
  useDebounceFn,
  useLatest,
  useLocalStorageState,
  useMemoizedFn,
  useTimeout,
} from 'ahooks';
import {
  type FieldNode,
  getOperationAST,
  Kind,
  OperationDefinitionNode,
  type SelectionSetNode,
} from 'graphql';
import { get, pick, set, uniqBy } from 'lodash';
import { MutableRefObject, useEffect, useMemo, useState } from 'react';
import type { Get, Paths, SetNonNullable } from 'type-fest';
import { type PaginatedListInput, type SortableListInput } from '~/api';
import type { Order } from '~/api/schema/schema.graphql';
import { lowerCase, upperCase } from '~/common';
import { convertMuiFiltersToApi, FilterShape } from './convertMuiFiltersToApi';

type ListInput = SetNonNullable<
  Required<
    SortableListInput & PaginatedListInput & { filter?: Record<string, any> }
  >
>;

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

const defaultInitialInput = {
  count: 25,
  sort: 'id',
  order: 'ASC' as Order,
};
const defaultKeyArgs = ['__typename', 'id'];

const persistColumnTypes = setOf<GridColType>(['singleSelect', 'boolean']);

type StoredViewState = Pick<DataGridProps, 'sortModel' | 'filterModel'> & {
  apiFilterModel?: FilterShape;
};
type ViewState = Omit<StoredViewState, 'apiFilterModel'> & {
  // The sorting state for the first page API query.
  // It could be the live sorting state, or a stale one,
  // based on pagination needs.
  apiSortModel: DataGridProps['sortModel'];
};

type NoInfer<T> = [T][T extends any ? 0 : never];

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
  apiRef: apiRefInput,
}: {
  query: DocumentNode<Output, Vars>;
  variables: NoInfer<Vars & { input?: Input }>;
  listAt: Path;
  initialInput?: Partial<Omit<NoInfer<Input>, 'page'>>;
  keyArgs?: string[];
  apiRef?: MutableRefObject<GridApiPro>;
}) => {
  const initialInputRef = useLatest(initialInput);
  // eslint-disable-next-line react-hooks/rules-of-hooks -- we'll assume this doesn't change between renders
  const apiRef = apiRefInput ?? useGridApiRef();

  const opName = useMemo(
    () =>
      query.definitions.find(
        (d): d is OperationDefinitionNode => d.kind === 'OperationDefinition'
      )!.name!.value,
    [query]
  );
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
          total: (updateTotal ? nextList : prevList)?.total ?? -1,
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
  const [storedView, setStoredView] = useLocalStorageState<StoredViewState>(
    `${opName}-data-grid-view`,
    {
      defaultValue: () => ({
        filterModel: { items: [] },
        apiFilterModel: {},
        sortModel: initialSort,
      }),
    }
  );
  const persist = useDebounceFn((next: ViewState) => {
    const filterModel = {
      // Strip out filters for columns that shouldn't be persisted
      items:
        next.filterModel?.items.filter((item) =>
          persistColumnTypes.has(apiRef.current.getColumn(item.field).type!)
        ) ?? [],
    };
    setStoredView({
      sortModel: next.sortModel,
      filterModel,
      apiFilterModel: convertMuiFiltersToApi(
        apiRef.current,
        filterModel,
        initialInputRef.current?.filter
      ),
    });
  });
  const [view, reallySetView] = useState((): ViewState => {
    const { apiFilterModel: _, ...rest } = storedView ?? {};
    return {
      ...rest,
      apiSortModel: storedView!.sortModel,
    };
  });
  const setView = (setter: (prev: ViewState) => ViewState) => {
    reallySetView((prev) => {
      const next = setter(prev);
      persist.run(next);
      return next;
    });
  };

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
      // eslint-disable-next-line no-extra-boolean-cast
      filter: Boolean(apiRef.current.instanceId)
        ? convertMuiFiltersToApi(
            apiRef.current,
            view.filterModel,
            initialInputRef.current?.filter
          )
        : storedView?.apiFilterModel,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiRef, initialInputRef, view.apiSortModel, view.filterModel]
  );
  const variablesWithFilter = useMemo(() => {
    const { count, sort, order, ...rest } = input;
    return {
      ...variables,
      input: {
        ...rest,
        ...variables.input,
        filter: {
          ...rest.filter,
          ...variables.input?.filter,
        },
      },
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
      () => ({
        ...variables,
        input: {
          ...input,
          page: 1,
          ...variables.input,
          filter: {
            ...input.filter,
            ...variables.input?.filter,
          },
        },
      }),
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
  const total = list?.total && list.total >= 0 ? list.total : undefined;

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
    slots: apiSlots,
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
