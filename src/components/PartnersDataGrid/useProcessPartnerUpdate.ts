import { useGridMutation } from '../Grid';
import { PartnerDataGridRowFragmentDoc as PartnerRow } from './partnerDataGridRow.graphql';
import { UpdatePartnerGridDocument as UpdatePartner } from './UpdatePartnerGrid.graphql';

export const useProcessPartnerUpdate = () =>
  useGridMutation(PartnerRow, UpdatePartner, (row) => ({
    variables: {
      input: {
        id: row.id,
        startDate: row.startDate.value,
      },
    },
    optimisticResponse: {
      updatePartner: {
        __typename: 'PartnerUpdated',
        partner: row,
      },
    },
  }));
