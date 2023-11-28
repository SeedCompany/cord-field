import { Skeleton, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { EditableSection } from '~/components/EditableSection';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface PartnerContactSectionProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
}

export const PartnerContactSection = ({
  partner,
  onEdit,
}: PartnerContactSectionProps) => {
  // TODO: Implement full address saving and parsing (st, city, state, etc)

  const canEdit = canEditAny(partner, false, 'address');

  return (
    <EditableSection
      canEdit={canEdit}
      title="Contact Information"
      onEdit={onEdit}
      loading={!partner}
    >
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Business Address
      </Typography>
      <Typography variant="h4">
        {!partner?.address.value ? (
          <Skeleton width="75%" />
        ) : (
          partner.address.value
        )}
      </Typography>
    </EditableSection>
  );
};
