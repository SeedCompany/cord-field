import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  EngagementDataGridRowFragment as Engagement,
  EngagementColumns,
} from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  flexLayout,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import { TabPanelContent } from '~/components/Tabs';
import { PartnerDetailEngagementsDocument } from './PartnerDetailEngagements.graphql';

const initialState = {
  pinnedColumns: {
    left: [EngagementColumns[0]!.field],
  },
} satisfies DataGridProps['initialState'];

export const PartnerDetailEngagements = () => {
  const { partnerId = '' } = useParams();

  const [props] = useDataGridSource({
    query: PartnerDetailEngagementsDocument,
    variables: { id: partnerId },
    listAt: 'partner.engagements',
    initialInput: {
      count: 25,
      sort: 'nameProjectFirst',
    },
  });

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

  return (
    <TabPanelContent>
      <DataGrid<Engagement>
        {...DefaultDataGridStyles}
        {...props}
        slotProps={slotProps}
        columns={EngagementColumns}
        initialState={initialState}
        headerFilters
        disableRowSelectionOnClick
        sx={[flexLayout, noHeaderFilterButtons]}
      />
    </TabPanelContent>
  );
};
