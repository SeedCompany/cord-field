import { GridColDef } from '@mui/x-data-grid';

export const booleanColumn = () =>
  ({
    type: 'boolean' as const,
  } satisfies Partial<GridColDef>);
