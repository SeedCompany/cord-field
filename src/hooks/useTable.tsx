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
import type {
  DataGridProProps as DataGridProps,
  GridFilterModel,
} from '@mui/x-data-grid-pro';
import {
  type FieldNode,
  getOperationAST,
  Kind,
  type SelectionSetNode,
} from 'graphql';
import { get, merge, pick, set, uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import type { Get, Paths, SetNonNullable } from 'type-fest';
import {
  FilterableListInput,
  isNetworkRequestInFlight,
  type PaginatedListInput,
  type PaginatedListOutput,
  type SortableListInput,
} from '~/api';
import type { Order } from '~/api/schema/schema.graphql';
import { lowerCase, upperCase } from '~/common';

type ListInput = SetNonNullable<
  Required<SortableListInput & PaginatedListInput & FilterableListInput>
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
  presetFilters,
  keyArgs = defaultKeyArgs,
}: {
  query: DocumentNode<Output, Vars>;
  variables: Vars;
  listAt: Path;
  initialInput?: Partial<ListInput>;
  presetFilters?: Record<string, any>;
  keyArgs?: string[];
}) => {
  const resolvedInitialInput = {
    ...defaultInitialInput,
    ...initialInput,
  };
  const [input, onChange] = useState(() => resolvedInitialInput);
  const [filterModel, setFilterModel] = useState<GridFilterModel>(() => ({
    items: [],
  }));

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
  const { data: allPages } = useQuery(query, {
    variables: {
      ...variables,
      ...(presetFilters && {
        input: { filter: { ...input.filter, ...presetFilters } },
      }),
    },
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
    variables: {
      ...variables,
      ...(presetFilters
        ? { input: { filter: { ...input.filter, ...presetFilters } } }
        : input),
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (next) => {
      // Add this page to the "all pages" cache entry
      // This is read back in the first useQuery hook, above.
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
    },
  });
  const currentPageList = currentPage
    ? (get(currentPage, listAt) as List)
    : undefined;

  const indexOffset = (input.page - 1) * input.count;
  const list = isCacheComplete
    ? allPagesList.items.slice(indexOffset, indexOffset + input.count)
    : currentPageList?.items;
  const total = allPagesList?.total ?? currentPageList?.total ?? 0;

  const dataGridProps = {
    rows: list ?? [],
    rowCount: total,
    loading: isNetworkRequestInFlight(networkStatus),
    filterModel,
    paginationModel: { page: input.page - 1, pageSize: input.count },
    sortModel: [{ field: input.sort, sort: lowerCase(input.order) }],
    onPaginationModelChange: (next) => {
      onChange((prev) => ({ ...prev, page: next.page + 1 }));
    },
    onSortModelChange: ([next]) => {
      if (!next) {
        onChange(resolvedInitialInput);
        return;
      }
      onChange((prev) => ({
        ...prev,
        page: 1,
        sort: next.field,
        order: upperCase(next.sort!),
      }));
    },
    onFilterModelChange: (next, { api }) => {
      setFilterModel(next);

      const parts = next.items.map((item) => {
        const col = api.getColumn(item.field);
        return item.value == null
          ? {}
          : col.serverFilter
          ? col.serverFilter(item)
          : set({}, item.field, item.value);
      });
      const filter = merge({}, ...parts);

      onChange((prev) => ({
        ...prev,
        page: 1,
        filter,
      }));
    },
    pagination: total > input.count,
    pageSizeOptions: [input.count],
    paginationMode: 'server',
    sortingMode: isCacheComplete ? 'client' : 'server',
    filterMode: isCacheComplete ? 'client' : 'server',
    slotProps: {
      filterPanel: {
        logicOperators: [GridLogicOperator.And],
        filterFormProps: {
          filterColumns,
        },
        getColumnForNewFilter,
      },
    },
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

declare module '@mui/x-data-grid/internals' {
  interface GridBaseColDef {
    /**
     * Customize how GridFilterItem converts to the filter object for API.
     * By default, the field name becomes the path key of the object.
     */
    serverFilter?: (item: GridFilterItem) => Record<string, any>;
  }
}
