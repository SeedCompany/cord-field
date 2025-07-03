import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
import { Redacted } from '~/components/Redacted';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface PartnerLocationProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const PartnerLocationSection = ({
  partner,
  onEdit,
}: PartnerLocationProps) => {
  const canEdit = canEditAny(partner, false, 'fieldRegions', 'countries');

  return (
    <ActionableSection
      title="Locations"
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
            Field Regions
          </Typography>
          {!partner ? (
            <Skeleton width="75%" />
          ) : partner.fieldRegions.canRead ? (
            partner.fieldRegions.value.length > 0 ? (
              <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
                {partner.fieldRegions.value.map((region) => (
                  <Typography
                    component="li"
                    variant="h4"
                    sx={{ listStyleType: 'none' }}
                    key={region.id}
                  >
                    {region.name.value}
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
              info="You cannot view this partner's field regions"
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
            Countries
          </Typography>
          {!partner ? (
            <Skeleton width="75%" />
          ) : partner.countries.canRead ? (
            partner.countries.value.length > 0 ? (
              <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
                {partner.countries.value.map((country) => (
                  <Typography
                    component="li"
                    variant="h4"
                    sx={{ listStyleType: 'none' }}
                    key={country.id}
                  >
                    {country.name.value}
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
              info="You cannot view this partner's countries"
              width="75%"
            />
          )}
        </Box>
      </Stack>
    </ActionableSection>
  );
};
