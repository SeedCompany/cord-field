import { Edit } from '@mui/icons-material';
import { Skeleton, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
import { Redacted } from '~/components/Redacted';
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
          <span>
            <IconButton
              disabled={!canEdit}
              onClick={onEdit}
              loading={!partner}
              size="small"
            >
              <Edit />
            </IconButton>
          </span>
        </Tooltip>
      }
    >
      <Typography
        component="h4"
        variant="body2"
        color="textSecondary"
        gutterBottom
      >
        PMC Entity Code
      </Typography>
      <Typography component="p" variant="h4">
        {!partner ? (
          <Skeleton width="3ch" />
        ) : !partner.pmcEntityCode.canRead ? (
          <Redacted info="You cannot view this partner's code" width="3ch" />
        ) : partner.pmcEntityCode.value ? (
          partner.pmcEntityCode.value
        ) : (
          <Typography
            variant="inherit"
            color="text.secondary"
            sx={{ fontStyle: 'italic' }}
          >
            None
          </Typography>
        )}
      </Typography>
    </ActionableSection>
  );
};
