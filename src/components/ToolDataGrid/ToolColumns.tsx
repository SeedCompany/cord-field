import { Box } from '@mui/material';
import {
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import {
  booleanColumn,
  getInitialVisibility,
  textColumn,
  Toolbar,
} from '../Grid';
import { Link } from '../Routing';
import { ToolDataGridRowFragment as Tool } from './toolDataGridRow.graphql';

export const ToolColumns: Array<GridColDef<Tool>> = [
  {
    field: 'name',
    ...textColumn(),
    headerName: 'Name',
    width: 240,
    valueGetter: (_, row) => row.name.value || '',
    renderCell: ({ value, row }) => (
      <Link to={`/tools/${row.id}`}>{value}</Link>
    ),
    hideable: false,
  },
  {
    field: 'aiBased',
    ...booleanColumn(),
    headerName: 'AI-based',
    width: 120,
    valueGetter: (_, row) => row.aiBased.value,
  },
  {
    field: 'usageCount',
    headerName: 'Usages',
    description: 'Total engagements and projects using this tool',
    type: 'number',
    width: 130,
    valueGetter: (_, row) =>
      row.containerSummary.reduce((sum, c) => sum + c.total, 0),
    sortable: false,
    filterable: false,
  },
  {
    field: 'description',
    ...textColumn(),
    headerName: 'Description',
    flex: 1,
    minWidth: 500,
    valueGetter: (_, row) => row.description.value || '',
    sortable: false,
    filterable: false,
  },
];

export const ToolInitialState = {
  pinnedColumns: {
    left: ToolColumns.slice(0, 1).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(ToolColumns),
    },
  },
} satisfies DataGridProps['initialState'];

export const ToolToolbar = () => (
  <Toolbar sx={{ justifyContent: 'flex-start', gap: 2 }}>
    <Box flex={1}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </Box>
  </Toolbar>
);
