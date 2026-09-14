import { useGridMutation } from '../Grid';
import { PartnerDataGridRowFragmentDoc as PartnerRow } from './partnerDataGridRow.graphql.ts';
import { UpdatePartnerGridDocument as UpdatePartner } from './UpdatePartnerGrid.graphql.ts';

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
