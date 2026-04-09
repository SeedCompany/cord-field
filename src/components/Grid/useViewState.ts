import { GridColType, GridSortItem } from '@mui/x-data-grid';
import {
  DataGridProProps as DataGridProps,
  GridApiPro,
} from '@mui/x-data-grid-pro';
import { setOf } from '@seedcompany/common';
import { useDebounceFn, useLatest, useLocalStorageState } from 'ahooks';
import { merge } from 'lodash';
import { MutableRefObject, useMemo, useState } from 'react';
import type { SetNonNullable } from 'type-fest';
import type { PaginatedListInput, SortableListInput } from '~/api';
import type { Order } from '~/api/schema/schema.graphql';
import { lowerCase, upperCase } from '~/common';
import { useSession } from '../Session/Session';
import { convertMuiFiltersToApi, FilterShape } from './convertMuiFiltersToApi';

export type ListInput = SetNonNullable<
  Required<
    SortableListInput & PaginatedListInput & { filter?: Record<string, any> }
  >
>;

export const defaultInitialInput = {
  count: 25,
  sort: 'id',
  order: 'ASC' as Order,
};

// Only singleSelect and boolean columns are persisted across sessions.
// See: docs/data-grid-source.md#what-is-and-isnt-persisted
const persistColumnTypes = setOf<GridColType>(['singleSelect', 'boolean']);

export type StoredViewState = Pick<DataGridProps, 'filterModel'> & {
  sortModel: [GridSortItem];
  // Pre-computed so it's available before the grid mounts on first render.
  // See: docs/data-grid-source.md#the-apifiltermodel-field
  apiFilterModel?: FilterShape;
};

export type ViewState = Omit<StoredViewState, 'apiFilterModel'> & {
  // The sorting state for the first page API query.
  // It could be the live sorting state, or a stale one,
  // based on pagination needs.
  // See: docs/data-grid-source.md#apisortmodel-vs-sortmodel
  apiSortModel: DataGridProps['sortModel'];
};

export function useViewState<Vars extends { input?: any }>({
  opName,
  initialInput,
  apiRef,
  variables,
}: {
  opName: string;
  initialInput: Partial<Omit<ListInput, 'page'>> | undefined;
  apiRef: MutableRefObject<GridApiPro>;
  variables: Vars;
}) {
  const initialInputRef = useLatest(initialInput);

  const [initialSort] = useState((): ViewState['sortModel'] => [
    {
      field: initialInput?.sort ?? defaultInitialInput.sort,
      sort: lowerCase(initialInput?.order ?? defaultInitialInput.order),
    },
  ]);

  const { session } = useSession();

  // Key format: `<userId>:<operationName>-data-grid-view`
  // See: docs/data-grid-source.md#storage-key
  const [storedView, setStoredView] = useLocalStorageState<StoredViewState>(
    `${session?.id}:${opName}-data-grid-view`,
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
    const { apiFilterModel: _, ...rest } = storedView!; // not null: defaultValue is always provided
    return { ...rest, apiSortModel: rest.sortModel };
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
    return merge({}, variables, { input: rest }) as Vars;
  }, [variables, input]);

  return {
    view,
    setView,
    viewRef,
    hasFilter,
    input,
    variablesWithFilter,
    initialSort,
  };
}
