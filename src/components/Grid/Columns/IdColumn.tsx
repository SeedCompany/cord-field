import { Link as LinkIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid-pro';
import { SetRequired } from 'type-fest';
import { Link } from '../../../components/Routing';

export const IDColumn = <R extends GridValidRowModel>({
  valueGetter,
  title,
  destination,
  ...rest
}: SetRequired<GridColDef<R>, 'valueGetter'> & {
  title: string;
  destination: (val: string) => string;
}) =>
  ({
    headerName: title,
    width: 65,
    align: 'center',
    valueGetter: (...args) => valueGetter(...args).id,
    renderCell: ({ row }) => (
      <Tooltip title={`View ${title}`}>
        <IconButton
          size="small"
          color="primary"
          component={Link}
          to={destination(row.id)}
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
