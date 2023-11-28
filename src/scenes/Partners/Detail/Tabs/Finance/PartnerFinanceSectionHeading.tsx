import { Skeleton, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface PartnerFinanceSectionHeadingProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
}

export const PartnerFinanceSectionHeading = ({
  partner,
  onEdit,
}: PartnerFinanceSectionHeadingProps) => {
  const canEdit = canEditAny(partner, false, 'pmcEntityCode');

  return (
    <ActionableSection
      canPerformAction={canEdit}
      title="Finance"
      onAction={onEdit}
      loading={!partner}
    >
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Transfer Method
      </Typography>
      <Typography variant="h4">
        {!partner?.pmcEntityCode.value ? (
          <Skeleton width="75%" />
        ) : (
          partner.pmcEntityCode.value
        )}
      </Typography>
    </ActionableSection>
  );
};
