import { Grid } from '@mui/material';
import { Many } from 'lodash';
import { BooleanProperty } from '~/components/BooleanProperty';
import { EditablePartnerField } from '../../../Edit';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { PartnerContactSection } from './PartnerContactSection';
import { PartnerTypesSection } from './PartnerTypesSection';

interface Props {
  partner: PartnerDetailsFragment | undefined;
  editPartner: (item: Many<EditablePartnerField>) => void;
}

export const PartnerDetailProfile = ({ partner, editPartner: edit }: Props) => {
  return (
    <>
      <Grid container spacing={1} alignItems="center">
        <BooleanProperty
          label="Global Innovations Client"
          redacted="You do not have permission to view whether this is a Global Innovations Client"
          data={partner?.globalInnovationsClient}
          wrap={(node) => <Grid item>{node}</Grid>}
        />
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PartnerContactSection
            partner={partner}
            onEdit={() => edit('partner.address')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <PartnerTypesSection
            partner={partner}
            onEdit={() =>
              edit(['partner.types', 'partner.financialReportingTypes'])
            }
          />
        </Grid>
      </Grid>
    </>
  );
};
