import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import {
  DefaultDataGridStyles,
  flexLayout,
  noFooter,
  noHeaderFilterButtons,
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

  const slots = useMemo(
    () =>
      merge({}, DefaultDataGridStyles.slots, dataGridProps.slots, {
        toolbar: PartnerToolbar,
      } satisfies DataGridProps['slots']),
    [dataGridProps.slots]
  );

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

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
