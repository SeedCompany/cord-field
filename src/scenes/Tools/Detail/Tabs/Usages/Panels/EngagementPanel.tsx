import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { EngagementListInput } from '~/api/schema.graphql';
import {
  EngagementDataGridRowFragment as Engagement,
  EngagementColumns,
  EngagementInitialState,
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
import { TabPanelContent } from '~/components/Tabs';
import { EngagementListDocument } from '../../../../../Projects/List/EngagementList.graphql';

interface EngagementPanelProps {
  toolId: string;
}

export const EngagementPanel = ({ toolId }: EngagementPanelProps) => {
  const [dataGridProps] = useDataGridSource({
    query: EngagementListDocument,
    variables: {
      input: {
        filter: {
          tool: { id: toolId },
        },
      } satisfies EngagementListInput,
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
