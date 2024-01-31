import { Edit } from '@mui/icons-material';
import { Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
import { Redacted } from '~/components/Redacted';
import { Link } from '~/components/Routing';
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

  const canEdit = canEditAny(
    partner,
    false,
    'address',
    'websiteUrl',
    'socialUrl'
  );

  return (
    <ActionableSection
      title="Contact Information"
      loading={!partner}
      action={
        <Tooltip title="Edit Contact Information">
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
      <Typography
        component="h4"
        variant="body2"
        color="textSecondary"
        gutterBottom
      >
        Business Address
      </Typography>
      <Stack spacing={2}>
        <Typography component="p" variant="h4">
          {!partner ? (
            <Skeleton width="75%" />
          ) : !partner.address.canRead ? (
            <Redacted info="You cannot view this partner's code" width="75%" />
          ) : partner.address.value ? (
            partner.address.value
          ) : null}
        </Typography>
        <Typography
          component="h4"
          variant="body2"
          color="textSecondary"
          gutterBottom
        >
          Website URL
        </Typography>
      </Stack>
      <Stack spacing={2}>
        <Typography component="p" variant="h4">
          {!partner ? (
            <Skeleton width="75%" />
          ) : !partner.websiteUrl.canRead ? (
            <Redacted info="You cannot view this partner's code" width="75%" />
          ) : partner.websiteUrl.value ? (
            <Link
              external={true}
              to={partner.websiteUrl.value}
              key={partner.websiteUrl.value}
            >
              {partner.websiteUrl.value.replace(/^(https?:\/\/)/, '')}
            </Link>
          ) : null}
        </Typography>
        <Typography
          component="h4"
          variant="body2"
          color="textSecondary"
          gutterBottom
        >
          Social Media URL
        </Typography>
      </Stack>
      <Typography component="p" variant="h4">
        {!partner ? (
          <Skeleton width="75%" />
        ) : !partner.socialUrl.canRead ? (
          <Redacted info="You cannot view this partner's code" width="75%" />
        ) : partner.socialUrl.value ? (
          <Link
            external={true}
            to={partner.socialUrl.value}
            key={partner.socialUrl.value}
          >
            {partner.socialUrl.value.replace(/^(https?:\/\/)/, '')}
          </Link>
        ) : null}
      </Typography>
    </ActionableSection>
  );
};
