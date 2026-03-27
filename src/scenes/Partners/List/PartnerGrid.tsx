import { DataGridPro as DataGrid } from '@mui/x-data-grid-pro';
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
import { PartnerDataGridRowFragment as Partner } from '~/components/PartnersDataGrid/partnerDataGridRow.graphql';
import { useProcessPartnerUpdate } from '~/components/PartnersDataGrid/useProcessPartnerUpdate';
import { PartnersDocument } from './PartnerList.graphql';

export const PartnerGrid = () => {
  const [dataGridProps] = useDataGridSource({
    query: PartnersDocument,
    variables: { input: {} },
    listAt: 'partners',
    initialInput: {
      sort: 'organization.name',
    },
  });

  const { slots, slotProps } = useDataGridSlots(dataGridProps, {
    slots: { toolbar: PartnerToolbar },
  });

  const processPartnerUpdate = useProcessPartnerUpdate();

  return (
    <DataGrid<Partner>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slots={slots}
      slotProps={slotProps}
      columns={PartnerColumns}
      initialState={PartnerInitialState}
      processRowUpdate={processPartnerUpdate}
      headerFilters
      hideFooter
      sx={[flexLayout, noHeaderFilterButtons, noFooter]}
    />
  );
};
