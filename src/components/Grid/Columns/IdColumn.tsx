import { Link as LinkIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid-pro';
import { SetRequired } from 'type-fest';
import { Link } from '../../../components/Routing';

export const ProgressReportIDColumn = <R extends GridValidRowModel>({
  valueGetter,
  ...rest
}: SetRequired<GridColDef<R>, 'valueGetter'>) =>
  ({
    headerName: 'Report',
    width: 65,
    align: 'center',
    valueGetter: (...args) => valueGetter(...args).id,
    renderCell: ({ row }) => (
      <Tooltip title="View Report">
        <IconButton
          size="small"
          color="primary"
          component={Link}
          to={`/progress-reports/${row.id}`}
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
    ),
    filterable: false,
    sortable: false,
    hideable: false,
    resizable: false,
    ...rest,
  } satisfies Partial<GridColDef<R>>);
