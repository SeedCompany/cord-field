import { Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { EditableSection } from '~/components/EditableSection';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface AddressCardProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
}

export const PartnerContactSection = ({
  partner,
  onEdit,
}: AddressCardProps) => {
  // TODO: Implement full address saving and parsing (st, city, state, etc)

  const canEdit = canEditAny(partner, false, 'address');

  return (
    <EditableSection
      canEdit={canEdit}
      title="Contact Information"
      tooltipTitle="Edit Address"
      onEdit={onEdit}
      loading={!partner}
    >
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Business Address
      </Typography>
    </EditableSection>
  );
};
