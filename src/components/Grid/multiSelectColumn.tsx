import {
  GridColDef,
  GridFilterInputMultipleSingleSelect,
  GridFilterInputSingleSelect,
} from '@mui/x-data-grid-pro';
import { cleanJoin } from '@seedcompany/common';
import { EmptyEnumFilterValue } from './DefaultDataGridStyles';

export const multiSelectColumn = <T extends string>(
  list: readonly T[],
  labels: Record<T, string>
) =>
  ({
    type: 'singleSelect',
    filterOperators: [
      {
        value: 'is',
        getApplyFilterFn: (filterItem) => {
          if (filterItem.value == null || filterItem.value === '') {
            return null;
          }

          return (value) =>
            Array.isArray(value)
              ? value.includes(filterItem.value)
              : value === filterItem.value;
        },
        InputComponent: GridFilterInputSingleSelect,
      },
      {
        value: 'isAnyOf',
        getApplyFilterFn: (filterItem) => {
          if (!filterItem.value || filterItem.value.length === 0) {
            return null;
          }

          const filterItemValues: string[] = filterItem.value.map(
            (item: string) => item
          );

          return (value): boolean =>
            filterItemValues.some((item) => value.includes(item));
        },
        InputComponent: GridFilterInputMultipleSingleSelect,
      },
    ],
    valueOptions: list.slice(),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    getOptionLabel: (v) => labels[v as T] ?? EmptyEnumFilterValue,
    valueFormatter: (value) => cleanJoin(', ', value),
  } satisfies Partial<GridColDef<any, T, string>>);
