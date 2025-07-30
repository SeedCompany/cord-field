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
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { TabPanelContent } from '~/components/Tabs';
import {
  FieldRegionProjectDataGridRowFragment as FieldRegionProject,
  FieldRegionProjectsDocument,
} from './FieldRegionProjects.graphql';

export const FieldRegionProjects = () => {
  const { fieldRegionId = '' } = useParams();

  const [props] = useDataGridSource({
    query: FieldRegionProjectsDocument,
    variables: { fieldRegionId },
    listAt: 'fieldRegion.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, props.slots, {
        toolbar: ProjectToolbar,
      } satisfies DataGridProps['slots']),
    [props.slots]
  );
  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

  return (
    <TabPanelContent>
      <DataGrid<FieldRegionProject>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={FieldRegionProjectColumns}
        initialState={ProjectInitialState}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};

// Remove the 'fieldRegion' column since this view is scoped to a specific field region
const FieldRegionProjectColumns = ProjectColumns.filter(
  (col) => col.field !== 'fieldRegion.name'
);
