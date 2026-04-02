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
  type FieldZoneProjectDataGridRowFragment as FieldZoneProject,
  FieldZoneProjectsDocument,
} from './FieldZoneProjects.graphql';

export const FieldZoneProjectsPanel = () => {
  const { fieldZoneId = '' } = useParams();

  const [dataGridProps] = useDataGridSource({
    query: FieldZoneProjectsDocument,
    variables: { fieldZoneId },
    listAt: 'fieldZone.projects',
    initialInput: {
      sort: 'name',
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: ProjectToolbar },
  });

  return (
    <TabPanelContent>
      <DataGrid<FieldZoneProject>
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

const _EnforceFieldZoneProjectIsSupersetOfProject: Project =
  undefined as unknown as FieldZoneProject;
