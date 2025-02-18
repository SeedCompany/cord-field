import {
  GridFilterInputMultipleSingleSelect,
  GridFilterInputSingleSelect,
} from '@mui/x-data-grid-pro';
import { setOf } from '@seedcompany/common';
import { column, RowLike } from './definition.types';
import { enumColumn } from './enumColumn';

export const multiEnumColumn = <Row extends RowLike, T extends string>(
  list: readonly T[],
  labels: Record<T, string>
) => {
  const { renderEditCell: _, ...base } = enumColumn(list, labels);
  const valuesFormatter = (values: T[]) =>
    values.map(base.valueFormatter).join(', ');
  return column<Row, readonly T[], string>()({
    ...base,
    filterOperators: [
      {
        value: 'is',
        label: 'has',
        headerLabel: 'has',
        getApplyFilterFn: (filterItem) => {
          const filtered = filterItem.value as T | undefined;
          if (!filtered) {
            return null;
          }
          return (values) => values.includes(filtered);
        },
        getValueAsString: base.valueFormatter,
        InputComponent: GridFilterInputSingleSelect,
      },
      {
        value: 'isAnyOf',
        label: 'has any of',
        headerLabel: 'has any of',
        getApplyFilterFn: (filterItem) => {
          const filtered = setOf<T>(filterItem.value);
          if (filtered.size === 0) {
            return null;
          }
          return (values) => values.some((value) => filtered.has(value));
        },
        getValueAsString: valuesFormatter,
        InputComponent: GridFilterInputMultipleSingleSelect,
      },
    ],
    valueFormatter: valuesFormatter,
    sortable: false,
    sortBy: undefined,
  });
};
