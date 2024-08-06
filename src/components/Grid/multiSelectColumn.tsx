import {
  GridColDef,
  GridFilterInputMultipleSingleSelect,
  GridFilterInputSingleSelect,
} from '@mui/x-data-grid-pro';
import { isObject } from '@mui/x-data-grid/internals';
import { cmpBy } from '@seedcompany/common';
import { EmptyEnumFilterValue } from './DefaultDataGridStyles';

const parseObjectValue = (value: unknown) => {
  if (value == null || !isObject<{ value: unknown }>(value)) {
    return value;
  }
  return value.value;
};

export const multiSelectColumn = <T extends string>(
  list: readonly T[],
  labels: Record<T, string>,
  { orderByIndex }: { orderByIndex?: boolean } = {}
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
          return (value): boolean => {
            const splitValue =
              typeof value === 'string' && value.includes(',')
                ? value.split(',').map((item) => item.trim())
                : value;
            if (typeof splitValue === 'string') {
              return (
                parseObjectValue(value) === parseObjectValue(filterItem.value)
              );
              // return (value): boolean => parseObjectValue(value) === parseObjectValue(filterItem.value);
            }

            const filteredArray = splitValue.filter((item) => {
              return (
                parseObjectValue(item) === parseObjectValue(filterItem.value)
              );
            });

            return filteredArray.length > 0 ? true : false;
          };
        },
        InputComponent: GridFilterInputSingleSelect,
      },
      {
        value: 'isAnyOf',
        getApplyFilterFn: (filterItem) => {
          console.log(filterItem);
          if (
            !Array.isArray(filterItem.value) ||
            filterItem.value.length === 0
          ) {
            return null;
          }
          const filterItemValues = filterItem.value.map(parseObjectValue);
          return (value): boolean =>
            filterItemValues.includes(parseObjectValue(value));
        },
        InputComponent: GridFilterInputMultipleSingleSelect,
      },
    ],
    valueOptions: list.slice(),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    getOptionLabel: (v) => labels[v as T] ?? EmptyEnumFilterValue,
    valueFormatter: (value: T) => labels[value],
    ...(orderByIndex ? { sortComparator: cmpBy((v) => list.indexOf(v)) } : {}),
  } satisfies Partial<GridColDef<any, T, string>>);
