import { Edit } from '@mui/icons-material';
import { Skeleton, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
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
      title="Finance"
      loading={!partner}
      action={
        <Tooltip title="Edit">
          <IconButton
            disabled={!canEdit}
            onClick={onEdit}
            loading={!partner}
            size="small"
          >
            <Edit />
          </IconButton>
        </Tooltip>
      }
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
