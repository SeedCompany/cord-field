import { Grid } from '@mui/material';
import { Many } from 'lodash';
import { EditablePartnerField } from '../../../Edit';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { PartnerFinanceSectionHeading } from './PartnerFinanceSectionHeading';

interface Props {
  partner: PartnerDetailsFragment | undefined;
  editPartner: (item: Many<EditablePartnerField>) => void;
}

export const PartnerDetailFinance = ({ partner, editPartner: edit }: Props) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <PartnerFinanceSectionHeading
          partner={partner}
          onEdit={() => edit('partner.pmcEntityCode')}
        />
      </Grid>
    </Grid>
  );
};
