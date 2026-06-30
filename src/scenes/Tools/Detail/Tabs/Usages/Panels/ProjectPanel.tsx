import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { ProjectListInput } from '~/api/schema.graphql';
import { useIsMobile } from '~/common';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import { EntityList as ToolsProjectsList } from '~/components/List';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
  ProjectInitialState,
  ProjectToolbar,
} from '~/components/ProjectDataGrid';
import { SensitivityIcon } from '~/components/Sensitivity';
import { TabPanelContent } from '~/components/Tabs';
import { ProjectListDocument } from '../../../../../Projects/List/ProjectList.graphql';

interface ProjectPanelProps {
  toolId: string;
}

const projectFilter = (toolId: string) =>
  ({ filter: { tool: { id: toolId } } } satisfies ProjectListInput);

export const ProjectPanel = ({ toolId }: ProjectPanelProps) => {
  const isMobile = useIsMobile();
  return isMobile ? (
    <ToolsProjectsList
      query={ProjectListDocument}
      listAt={(data) => data.projects}
      variables={{ input: projectFilter(toolId) }}
      columns={ProjectColumns}
      sortDefault={{ field: 'name', direction: 'ASC' }}
      defaultSecondaryField="primaryLocation.name"
      primary={(project) => project.name.value}
      to={(project) => `/projects/${project.id}`}
      avatar={(project) => <SensitivityIcon value={project.sensitivity} />}
    />
  ) : (
    // The grid (and its `useDataGridSource`) must only mount on desktop.
    <ProjectPanelGrid toolId={toolId} />
  );
};

const ProjectPanelGrid = ({ toolId }: ProjectPanelProps) => {
  const [dataGridProps] = useDataGridSource({
    query: ProjectListDocument,
    variables: {
      input: projectFilter(toolId),
    },
    listAt: 'projects',
    initialInput: {
      sort: 'name',
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: ProjectToolbar },
  });

  return (
    <TabPanelContent>
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
    </TabPanelContent>
  );
};
