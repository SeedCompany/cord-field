import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
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
import { PartnerTabContainer } from '../PartnerTabContainer';
import { PartnerDetailEngagementsDocument } from './PartnerDetailEngagements.graphql';

const initialState = {
  pinnedColumns: {
    left: [EngagementColumns[0]!.field],
  },
};

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
    <PartnerTabContainer
      sx={{
        flex: 1,
        p: 0,
        maxWidth: '100cqw',
        width: 'min-content',
        // idk why -50, MUI pushes down past container
        maxHeight: 'calc(100cqh - 50px)',
      }}
    >
      <DataGrid<Engagement>
        {...DefaultDataGridStyles}
        {...props}
        slotProps={slotProps}
        columns={EngagementColumns}
        disableRowSelectionOnClick
        headerFilters
        initialState={initialState}
        sx={[flexLayout, noHeaderFilterButtons]}
      />
    </PartnerTabContainer>
  );
};
