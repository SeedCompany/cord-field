import { Many } from 'lodash';
import { EditablePartnerField } from '../../../Edit';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { PartnerTabContainer } from '../PartnerTabContainer';
import { PartnerFinanceSectionHeading } from './PartnerFinanceSectionHeading';

interface Props {
  partner: PartnerDetailsFragment | undefined;
  editPartner: (item: Many<EditablePartnerField>) => void;
}

export const PartnerDetailFinance = ({ partner, editPartner: edit }: Props) => (
  <PartnerTabContainer>
    <PartnerFinanceSectionHeading
      partner={partner}
      onEdit={() => edit('partner.pmcEntityCode')}
    />
  </PartnerTabContainer>
);
