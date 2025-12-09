import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
