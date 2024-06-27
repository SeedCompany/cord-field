import {
  getGridStringOperators,
  GridColDef,
  GridFilterOperator,
} from '@mui/x-data-grid-pro';

export const containsOperator = {
  ...(getGridStringOperators()[0]! as GridFilterOperator<
    any,
    string | null,
    any
  >),
  label: 'search',
  headerLabel: 'search',
};

export const textColumn = () =>
  ({
    filterOperators: [containsOperator],
  } satisfies Partial<GridColDef<any, string | null, any>>);
