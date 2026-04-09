import { Box } from '@mui/material';
import {
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import { LocationTypeLabels, LocationTypeList } from '~/api/schema.graphql';
import { enumColumn, getInitialVisibility, textColumn, Toolbar } from '../Grid';
import { Link } from '../Routing';
import { LocationDataGridRowFragment as Location } from './locationDataGridRow.graphql';

export const LocationColumns: Array<GridColDef<Location>> = [
  {
    field: 'name',
    ...textColumn(),
    headerName: 'Name',
    width: 200,
    valueGetter: (_, row) => row.name.value || '',
    renderCell: ({ value, row }) => {
      return <Link to={`/locations/${row.id}`}>{value}</Link>;
    },
  },
  {
    field: 'type',
    ...enumColumn(LocationTypeList, LocationTypeLabels),
    headerName: 'Type',
    width: 150,
    valueGetter: (_, row) => row.type.value || '',
  },
  {
    field: 'defaultFieldRegion',
    ...textColumn(),
    headerName: 'Field Region',
    width: 200,
    valueGetter: (_, row) => row.defaultFieldRegion.value?.name.value || '',
    renderCell: ({ value, row }) => {
      const fieldRegion = row.defaultFieldRegion.value;
      return fieldRegion ? (
        <Link to={`/field-regions/${fieldRegion.id}`}>{value}</Link>
      ) : null;
    },
  },
];

export const LocationInitialState = {
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(LocationColumns),
    },
  },
} satisfies DataGridProps['initialState'];

export const LocationToolbar = () => (
  <Toolbar sx={{ justifyContent: 'flex-start', gap: 2 }}>
    <Box flex={1}>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
    </Box>
  </Toolbar>
);
