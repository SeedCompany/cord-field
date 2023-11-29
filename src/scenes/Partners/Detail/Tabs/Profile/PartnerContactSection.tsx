import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
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
      title="Contact Information"
      loading={!partner}
      actionTooltip={
        <Tooltip title="Edit Contact Information">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              disabled={!canEdit}
              onClick={onEdit}
              loading={!partner}
              size="small"
            >
              <Edit />
            </IconButton>
          </Box>
        </Tooltip>
      }
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
