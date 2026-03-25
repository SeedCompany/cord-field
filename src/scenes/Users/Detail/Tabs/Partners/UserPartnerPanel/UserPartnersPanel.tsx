import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
import { useParams } from 'react-router-dom';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
  useDataGridSlots,
  useDataGridSource,
} from '~/components/Grid';
import {
  PartnerColumns,
  PartnerInitialState,
  PartnerToolbar,
} from '~/components/PartnersDataGrid/PartnerColumns';
import { PartnerDataGridRowFragment as UserPartner } from '~/components/PartnersDataGrid/partnerDataGridRow.graphql';
import { UserPartnersDocument } from './UserPartnerList.graphql';

export const UserPartnersPanel = () => {
  const { userId = '' } = useParams();

  const [dataGridProps] = useDataGridSource({
    query: UserPartnersDocument,
    variables: { userId },
    listAt: 'user.partners',
    initialInput: {
      sort: 'organization.name',
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: PartnerToolbar },
  });

  return (
    <DataGrid<UserPartner>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={PartnerColumns}
      initialState={PartnerInitialState}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
