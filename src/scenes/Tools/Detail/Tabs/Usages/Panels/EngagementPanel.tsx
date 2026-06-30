import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { EngagementListInput } from '~/api/schema.graphql';
import { useIsMobile } from '~/common';
import {
  EngagementDataGridRowFragment as Engagement,
  EngagementColumns,
  EngagementInitialState,
  engagementName,
  EngagementToolbar,
  useProcessEngagementUpdate,
} from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import { EntityList as ToolsEngagementsList } from '~/components/List';
import { SensitivityIcon } from '~/components/Sensitivity';
import { TabPanelContent } from '~/components/Tabs';
import { EngagementListDocument } from '../../../../../Projects/List/EngagementList.graphql';

interface EngagementPanelProps {
  toolId: string;
}

const engagementFilter = (toolId: string) =>
  ({ filter: { tool: { id: toolId } } } satisfies EngagementListInput);

export const EngagementPanel = ({ toolId }: EngagementPanelProps) => {
  const isMobile = useIsMobile();
  return isMobile ? (
    <ToolsEngagementsList
      query={EngagementListDocument}
      listAt={(data) => data.engagements}
      variables={{ input: engagementFilter(toolId) }}
      columns={EngagementColumns}
      sortDefault={{ field: EngagementColumns[0]!.field, direction: 'ASC' }}
      defaultSecondaryField="project.name"
      primary={engagementName}
      to={(engagement) => `/engagements/${engagement.id}`}
      avatar={(engagement) => (
        <SensitivityIcon value={engagement.project.sensitivity} />
      )}
    />
  ) : (
    // The grid (and its `useDataGridSource`) must only mount on desktop.
    <EngagementPanelGrid toolId={toolId} />
  );
};

const EngagementPanelGrid = ({ toolId }: EngagementPanelProps) => {
  const [dataGridProps] = useDataGridSource({
    query: EngagementListDocument,
    variables: {
      input: engagementFilter(toolId),
    },
    listAt: 'engagements',
    initialInput: {
      sort: EngagementColumns[0]!.field,
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: EngagementToolbar },
  });

  const processRowUpdate = useProcessEngagementUpdate();

  return (
    <TabPanelContent>
      <DataGrid<Engagement>
        {...DefaultDataGridStyles}
        {...dataGridProps}
        slots={slots}
        slotProps={slotProps}
        columns={EngagementColumns}
        initialState={EngagementInitialState}
        processRowUpdate={processRowUpdate}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};
