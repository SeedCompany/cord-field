import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
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
import { PartnerDetailEngagementsDocument } from './PartnerDetailEngagements.graphql';

export const PartnerDetailEngagements = () => {
  const { partnerId = '' } = useParams();

  const [props] = useDataGridSource({
    query: PartnerDetailEngagementsDocument,
    variables: { id: partnerId },
    listAt: 'partner.engagements',
    initialInput: {
      sort: EngagementColumns[0]!.field,
    },
  });

  const { slots, slotProps } = useDataGridSlots(props, {
    slots: { toolbar: EngagementToolbar },
  });

  const processEngagementUpdate = useProcessEngagementUpdate();

  return (
    <TabPanelContent>
      <DataGrid<Engagement>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={EngagementColumns}
        initialState={EngagementInitialState}
        processRowUpdate={processEngagementUpdate}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};
