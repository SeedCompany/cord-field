import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
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

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: UserToolbar,
      } satisfies DataGridProps['slots']),
    [dataGridProps.slots]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

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
