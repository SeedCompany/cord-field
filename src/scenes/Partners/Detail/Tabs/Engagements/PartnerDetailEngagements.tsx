import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
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
import { EntityList as PartnersEngagementsList } from '~/components/List';
import { SensitivityIcon } from '~/components/Sensitivity';
import { TabPanelContent } from '~/components/Tabs';
import { PartnerDetailEngagementsDocument } from './PartnerDetailEngagements.graphql';

export const PartnerDetailEngagements = () => {
  const { partnerId = '' } = useParams();
  const isMobile = useIsMobile();

  return isMobile ? (
    <PartnersEngagementsList
      query={PartnerDetailEngagementsDocument}
      listAt={(data) => data.partner.engagements}
      variables={{ id: partnerId }}
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
    <PartnerEngagementsGrid />
  );
};

const PartnerEngagementsGrid = () => {
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

  const processRowUpdate = useProcessEngagementUpdate();

  return (
    <TabPanelContent>
      <DataGrid<Engagement>
        {...DefaultDataGridStyles}
        {...props}
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
