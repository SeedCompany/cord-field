import { Skeleton, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { EditableSection } from '~/components/EditableSection';
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
    <EditableSection
      canEdit={canEdit}
      title="Finance"
      onEdit={onEdit}
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
    </EditableSection>
  );
};
