import { Box } from '@mui/material';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid-pro';
import { SetRequired } from 'type-fest';
import { ProjectDataGridBaseRowFragment } from '../../../components/ProjectDataGrid';
import { SensitivityIcon } from '../../../components/Sensitivity';
import { textColumn } from '../ColumnTypes/textColumn';

export const SensitivityColumn = <R extends GridValidRowModel>({
  valueGetter,
  ...rest
}: SetRequired<GridColDef<R, ProjectDataGridBaseRowFragment>, 'valueGetter'>) =>
  ({
    ...textColumn(),
    headerName: 'Sensitivity',
    width: 110,
    valueGetter: (...args) => valueGetter(...args).sensitivity,
    renderCell: ({ value }) => (
      <Box display="flex" alignItems="center" gap={1} textTransform="uppercase">
        <SensitivityIcon value={value} disableTooltip />
        {value}
      </Box>
    ),
    hideable: false,
    ...rest,
  } satisfies Partial<GridColDef<R>>);
