import { Link as LinkIcon } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-pro';
import { Merge } from 'type-fest';
import { Link } from '../../Routing';
import {
  columnWithDefaults,
  RowLike,
  WithValueGetterReturning,
} from '../ColumnTypes/definition.types';

export const LinkColumn = <Row extends RowLike>({
  valueGetter,
  field,
  destination,
  ...overrides
}: Merge<
  GridColDef<Row>,
  Partial<WithValueGetterReturning<{ id: string }, Row>>
> & {
  destination: (val: string) => string;
}) =>
  columnWithDefaults<Row>()(overrides, {
    field,
    width: 54, // enough width for the icon, not the header name.
    align: 'center',
    valueGetter: (...args) => (valueGetter ?? (() => args[1]))(...args).id,
    renderCell: ({ row }) => (
      <Tooltip title={`View ${field}`}>
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
  });
