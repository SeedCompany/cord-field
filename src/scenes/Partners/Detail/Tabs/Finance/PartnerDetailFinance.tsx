import { Many } from 'lodash';
import { TabPanelContent } from '~/components/Tabs';
import { EditablePartnerField } from '../../../Edit';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { PartnerFinanceSectionHeading } from './PartnerFinanceSectionHeading';

interface Props {
  partner: PartnerDetailsFragment | undefined;
  editPartner: (item: Many<EditablePartnerField>) => void;
}

export const PartnerDetailFinance = ({ partner, editPartner: edit }: Props) => (
  <TabPanelContent>
    <PartnerFinanceSectionHeading
      partner={partner}
      onEdit={() => edit('partner.pmcEntityCode')}
    />
  </TabPanelContent>
);
