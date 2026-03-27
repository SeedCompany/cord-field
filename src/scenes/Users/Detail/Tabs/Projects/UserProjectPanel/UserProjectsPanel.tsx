import { DataGridPro as DataGrid, GridColDef } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import { RoleLabels, RoleList } from '~/api/schema.graphql';
import {
  DefaultDataGridStyles,
  flexLayout,
  multiEnumColumn,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import {
  insertProjectColumnAfterField,
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectNameField,
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

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: ProjectToolbar },
  });

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

const UserProjectColumns = insertProjectColumnAfterField(
  // MUI DataGrid column defs are invariant in row type due to callback signatures.
  // The runtime usage is safe because UserProject includes all fields consumed below.
  ProjectColumns as Array<GridColDef<UserProject>>,
  ProjectNameField,
  UserProjectRoleColumn
);

const _EnforceUserProjectIsSupersetOfProject: Project =
  undefined as unknown as UserProject;
