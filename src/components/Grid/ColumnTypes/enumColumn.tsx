import { getGridSingleSelectOperators } from '@mui/x-data-grid-pro';
import { EmptyEnumFilterValue } from '../DefaultDataGridStyles';
import { column, RowLike } from './definition.types';

export const enumColumn = <Row extends RowLike, T extends string>(
  list: readonly T[],
  labels: Record<T, string>,
  { orderByIndex }: { orderByIndex?: boolean } = {}
) =>
  column<Row, T, string>()({
    type: 'singleSelect',
    filterOperators: getGridSingleSelectOperators().filter(
      (op) => op.value !== 'not'
    ),
    valueOptions: list.slice(),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    getOptionLabel: (v) => labels[v as T] ?? EmptyEnumFilterValue,
    valueFormatter: (value: T) => labels[value],
    ...(orderByIndex ? { sortBy: (v) => (v ? list.indexOf(v) : null) } : {}),
  });
