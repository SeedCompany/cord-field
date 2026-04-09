import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import {
  UserColumns,
  UserInitialState,
  UserToolbar,
} from '~/components/UserDataGrid/UserColumns';
import { UserDataGridRowFragment as People } from '~/components/UserDataGrid/userDataGridRow.graphql';
import { UsersDocument } from './users.graphql';

export const UserGrid = () => {
  const [dataGridProps] = useDataGridSource({
    query: UsersDocument,
    variables: {},
    listAt: 'users',
    initialInput: {
      sort: 'fullName',
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: UserToolbar },
  });

  return (
    <DataGrid<People>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={UserColumns}
      initialState={UserInitialState}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
