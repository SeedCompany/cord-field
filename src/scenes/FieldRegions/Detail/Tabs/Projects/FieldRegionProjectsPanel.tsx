import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { TabPanelContent } from '~/components/Tabs';
import {
  type FieldRegionProjectDataGridRowFragment as FieldRegionProject,
  FieldRegionProjectsDocument,
} from './FieldRegionProjects.graphql';

export const FieldRegionProjectsPanel = () => {
  const { fieldRegionId = '' } = useParams();

  const [dataGridProps] = useDataGridSource({
    query: FieldRegionProjectsDocument,
    variables: { fieldRegionId },
    listAt: 'fieldRegion.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: ProjectToolbar },
  });

  return (
    <TabPanelContent>
      <DataGrid<FieldRegionProject>
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
    </TabPanelContent>
  );
};

const _EnforceFieldRegionProjectIsSupersetOfProject: Project =
  undefined as unknown as FieldRegionProject;
