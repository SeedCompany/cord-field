import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { RoleLabels, RoleList } from '~/api/schema.graphql';
import { unmatchedIndexThrow } from '~/common';
import {
  DefaultDataGridStyles,
  flexLayout,
  multiEnumColumn,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import {
  UserProjectDataGridRowFragment as UserProject,
  UserProjectsDocument,
} from './UserProjectList.graphql';

export const UserProjectsPanel = () => {
  const { userId = '' } = useParams();

  const [dataGridProps] = useDataGridSource({
    query: UserProjectsDocument,
    variables: { userId },
    listAt: 'user.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: ProjectToolbar,
      } satisfies DataGridProps['slots']),
    [dataGridProps.slots]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

  return (
    <DataGrid<UserProject>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={UserProjectColumns}
      initialState={ProjectInitialState}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};

const UserProjectRoleColumn: GridColDef<UserProject> = {
  field: 'user.membership',
  headerName: 'Role',
  width: 300,
  ...multiEnumColumn(RoleList, RoleLabels),
  valueGetter: (_, { membership }) => membership.roles.value,
};

const indexAfterName =
  unmatchedIndexThrow(ProjectColumns.findIndex((c) => c.field === 'name')) + 1;

const UserProjectColumns = (ProjectColumns as Array<GridColDef<UserProject>>)
  // Add roles' column after name
  .toSpliced(indexAfterName, 0, UserProjectRoleColumn);
