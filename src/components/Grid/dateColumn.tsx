import { getGridDateOperators, GridColDef } from '@mui/x-data-grid';
import { GridHeaderAddFilterButton } from './GridHeaderAddFilterButton';

export const dateColumn = () =>
  ({
    type: 'date' as const,
    renderHeaderFilter: GridHeaderAddFilterButton,
    filterOperators: getGridDateOperators().filter(
      (operator) => operator.value !== 'is' && operator.value !== 'not'
    ),
  } satisfies Partial<GridColDef>);
