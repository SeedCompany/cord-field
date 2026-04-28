import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { ProjectListInput } from '~/api/schema.graphql';
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
import { ProjectListDocument } from '../../../../../Projects/List/ProjectList.graphql';

interface ProjectPanelProps {
  toolId: string;
}

export const ProjectPanel = ({ toolId }: ProjectPanelProps) => {
  const [dataGridProps] = useDataGridSource({
    query: ProjectListDocument,
    variables: {
      input: {
        // `tool` filter not yet in local schema types — cast until codegen catches up.
        filter: {
          tool: { id: toolId },
        } as unknown as ProjectListInput['filter'],
      } satisfies ProjectListInput,
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
