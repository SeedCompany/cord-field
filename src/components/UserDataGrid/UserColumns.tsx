import {
  DataGridProProps as DataGridProps,
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import {
  RoleLabels,
  RoleList,
  UserStatusLabels,
  UserStatusList,
} from '~/api/schema.graphql';
import {
  booleanColumn,
  enumColumn,
  getInitialVisibility,
  multiEnumColumn,
  QuickFilterButton,
  QuickFilterResetButton,
  QuickFilters,
  textColumn,
  Toolbar,
  useFilterToggle,
} from '../Grid';
import { UserNameColumn } from '../Grid/Columns/UserNameColumn';
import { UserDataGridRowFragment as User } from './userDataGridRow.graphql';

export const UserColumns: Array<GridColDef<User>> = [
  UserNameColumn({
    field: 'fullName',
    headerName: 'Name',
    valueGetter: (_, user) => user,
    serverFilter: (value) => ({ name: value }),
  }),
  {
    headerName: 'Title',
    field: 'title',
    width: 350,
    ...textColumn(),
    valueGetter: (_, row) => row.title.value,
  },
  {
    headerName: 'Roles',
    description: 'Roles',
    field: 'roles',
    width: 200,
    ...multiEnumColumn(RoleList, RoleLabels),
    valueGetter: (_, { roles }) => {
      return roles.value;
    },
  },
  {
    headerName: 'Status',
    field: 'status',
    ...enumColumn(UserStatusList, UserStatusLabels),
    valueGetter: (_, row) => row.status.value,
  },
  {
    headerName: 'Pinned',
    field: 'pinned',
    ...booleanColumn(),
    valueGetter: (_, row) => row.pinned,
  },
];

export const UserInitialState = {
  pinnedColumns: {
    left: UserColumns.slice(0, 1).map((column) => column.field),
  },
  columns: {
    columnVisibilityModel: {
      ...getInitialVisibility(UserColumns),
      pinned: false,
    },
  },
} satisfies DataGridProps['initialState'];

export const UserToolbar = () => (
  <Toolbar sx={{ justifyContent: 'flex-start', gap: 2 }}>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <QuickFilters sx={{ flex: 1 }}>
      <QuickFilterResetButton />
      <QuickFilterButton {...useFilterToggle('pinned')}>
        Pinned
      </QuickFilterButton>
    </QuickFilters>
  </Toolbar>
);
