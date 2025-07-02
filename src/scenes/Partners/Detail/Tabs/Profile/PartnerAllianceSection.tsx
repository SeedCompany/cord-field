import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
import { Redacted } from '~/components/Redacted';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface PartnerTypesSectionProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const PartnerAllianceSection = ({
  partner,
  onEdit,
}: PartnerTypesSectionProps) => {
  const canEdit = canEditAny(partner, false, 'strategicAlliances', 'parent');

  return (
    <ActionableSection
      title="Alliance Information"
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
      <Stack
        direction="row"
        columnGap={4}
        rowGap={3}
        justifyContent="space-between"
        flexWrap="wrap"
        maxWidth={350}
      >
        <Box>
          <Typography
            component="h4"
            variant="body2"
            color="textSecondary"
            gutterBottom
          >
            Strategic Alliances
          </Typography>
          {!partner ? (
            <Skeleton width="75%" />
          ) : partner.strategicAlliances.canRead ? (
            partner.strategicAlliances.value.length > 0 ? (
              <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
                {partner.strategicAlliances.value.map((alliance) => (
                  <Typography
                    component="li"
                    variant="h4"
                    sx={{ listStyleType: 'none' }}
                    key={alliance.organization.value?.name.value}
                  >
                    {alliance.organization.value?.name.value}
                  </Typography>
                ))}
              </Stack>
            ) : (
              <Typography component="p" variant="h4">
                None
              </Typography>
            )
          ) : (
            <Redacted
              info="You cannot view this partner's strategic alliances"
              width="75%"
            />
          )}
        </Box>
        <Box>
          <Typography
            component="h4"
            variant="body2"
            color="textSecondary"
            gutterBottom
          >
            Parent Organization
          </Typography>
          <Typography component="p" variant="h4">
            {!partner ? (
              <Skeleton width="75%" />
            ) : !partner.parent.canRead ? (
              <Redacted
                info="You cannot view this partner's parent organization"
                width="75%"
              />
            ) : partner.parent.value?.organization.value?.name.value ? (
              partner.parent.value.organization.value.name.value
            ) : (
              <Typography
                component="span"
                variant="inherit"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                None
              </Typography>
            )}
          </Typography>
        </Box>
      </Stack>
    </ActionableSection>
  );
};
