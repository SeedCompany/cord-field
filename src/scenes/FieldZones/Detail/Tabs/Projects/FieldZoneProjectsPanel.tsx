import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '~/common';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import { EntityList as FieldZonesProjectsList } from '~/components/List';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { SensitivityIcon } from '~/components/Sensitivity';
import { TabPanelContent } from '~/components/Tabs';
import {
  type FieldZoneProjectDataGridRowFragment as FieldZoneProject,
  FieldZoneProjectsDocument,
} from './FieldZoneProjects.graphql';

export const FieldZoneProjectsPanel = () => {
  const { fieldZoneId = '' } = useParams();
  const isMobile = useIsMobile();

  return isMobile ? (
    <FieldZonesProjectsList
      query={FieldZoneProjectsDocument}
      listAt={(data) => data.fieldZone.projects}
      variables={{ fieldZoneId }}
      columns={ProjectColumns}
      sortDefault={{ field: 'name', direction: 'ASC' }}
      defaultSecondaryField="primaryLocation.name"
      primary={(project) => project.name.value}
      to={(project) => `/projects/${project.id}`}
      avatar={(project) => <SensitivityIcon value={project.sensitivity} />}
    />
  ) : (
    // ai edge-case The grid (and its `useDataGridSource`) must only mount on desktop.
    <FieldZoneProjectsGrid />
  );
};

const FieldZoneProjectsGrid = () => {
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
