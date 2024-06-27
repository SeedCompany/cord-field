import { getGridSingleSelectOperators, GridColDef } from '@mui/x-data-grid-pro';
import { cmpBy } from '@seedcompany/common';

export const enumColumn = <T extends string>(
  list: readonly T[],
  labels: Record<T, string>,
  { orderByIndex }: { orderByIndex?: boolean } = {}
) =>
  ({
    type: 'singleSelect',
    filterOperators: getGridSingleSelectOperators().filter(
      (op) => op.value !== 'not'
    ),
    valueOptions: list.map((v) => ({
      value: v,
      label: labels[v],
    })),
    valueFormatter: (value: T) => labels[value],
    ...(orderByIndex ? { sortComparator: cmpBy((v) => list.indexOf(v)) } : {}),
  } satisfies Partial<GridColDef<any, T, string>>);
