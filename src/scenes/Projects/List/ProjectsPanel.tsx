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
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { ProjectListDocument } from './ProjectList.graphql';

export const ProjectsPanel = () => {
  const [dataGridProps] = useDataGridSource({
    query: ProjectListDocument,
    variables: {},
    listAt: 'projects',
    initialInput: {
      sort: 'name',
    },
    sessionStorageProps: {
      key: 'projects-grid',
      defaultValue: ProjectInitialState,
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
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
