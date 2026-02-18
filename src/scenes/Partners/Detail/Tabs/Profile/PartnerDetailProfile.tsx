import { Unstable_Grid2 as Grid } from '@mui/material';
import { Many } from 'lodash';
import { BooleanProperty } from '~/components/BooleanProperty';
import { TabPanelContent } from '~/components/Tabs';
import { EditablePartnerField } from '../../../Edit';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { PartnerContactSection } from './PartnerContactSection';
import { PartnerLocationSection } from './PartnerLocationSection';
import { PartnerOrgReachAndTypeSection } from './PartnerOrgReachAndTypeSection';
import { PartnerTypesSection } from './PartnerTypesSection';

interface Props {
  partner: PartnerDetailsFragment | undefined;
  editPartner: (item: Many<EditablePartnerField>) => void;
}

export const PartnerDetailProfile = ({ partner, editPartner: edit }: Props) => (
  <TabPanelContent>
    <BooleanProperty
      label="Growth Partners' Client"
      redacted="You do not have permission to view whether this is a Growth Partners' Client"
      data={partner?.globalInnovationsClient}
      sx={{ mb: 1 }}
    />
    <Grid container spacing={3}>
      <Grid xs={12} md={6}>
        <PartnerContactSection
          partner={partner}
          onEdit={() => edit('partner.address')}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <PartnerTypesSection
          partner={partner}
          onEdit={() =>
            edit(['partner.types', 'partner.financialReportingTypes'])
          }
        />
      </Grid>
      <Grid xs={12} md={6}>
        <PartnerOrgReachAndTypeSection
          partner={partner}
          onEdit={() => edit(['organization.types', 'organization.reach'])}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <PartnerLocationSection
          partner={partner}
          onEdit={() => edit(['partner.fieldRegions', 'partner.countries'])}
        />
      </Grid>
    </Grid>
  </TabPanelContent>
);
