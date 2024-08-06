import { GridColDef } from '@mui/x-data-grid';

export const dateColumn = () =>
  ({
    type: 'date',
  } satisfies Partial<GridColDef>);
