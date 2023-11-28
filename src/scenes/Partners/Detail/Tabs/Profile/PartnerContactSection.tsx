import { Skeleton, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
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
    <ActionableSection
      canPerformAction={canEdit}
      title="Contact Information"
      onAction={onEdit}
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
    </ActionableSection>
  );
};
