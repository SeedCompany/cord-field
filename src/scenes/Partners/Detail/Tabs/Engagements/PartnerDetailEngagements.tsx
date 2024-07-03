import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
  GridFooter,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  EngagementDataGridRowFragment as Engagement,
  EngagementColumns,
  EngagementInitialState,
} from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
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
      sort: 'nameProjectFirst',
    },
  });

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, props.slots, {
        toolbar: GridFooter,
      } satisfies DataGridProps['slots']),
    [props.slots]
  );
  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

  return (
    <TabPanelContent>
      <DataGrid<Engagement>
        {...DefaultDataGridStyles}
        {...props}
        slots={slots}
        slotProps={slotProps}
        columns={EngagementColumns}
        initialState={EngagementInitialState}
        headerFilters
        hideFooter
        sx={[flexLayout, noHeaderFilterButtons, noFooter]}
      />
    </TabPanelContent>
  );
};
