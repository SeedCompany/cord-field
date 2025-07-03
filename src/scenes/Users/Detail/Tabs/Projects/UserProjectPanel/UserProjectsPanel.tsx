import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { UserProjectListDocument } from './UserProjectList.graphql';

export const UserProjectsPanel = () => {
  const { userId = '' } = useParams();

  const [dataGridProps] = useDataGridSource({
    query: UserProjectListDocument,
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
    <DataGrid<Project>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={ProjectColumns}
      initialState={ProjectInitialState}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
