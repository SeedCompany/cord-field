import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
import { Redacted } from '~/components/Redacted';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface PartnerLanguageSectionProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const PartnerLanguageSection = ({
  partner,
  onEdit,
}: PartnerLanguageSectionProps) => {
  const canEdit = canEditAny(
    partner,
    false,
    'languageOfWiderCommunication',
    'languageOfReporting',
    'languagesOfConsulting'
  );
  return (
    <ActionableSection
      title="Communications"
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
        maxWidth={600}
      >
        <Box>
          <Typography
            component="h4"
            variant="body2"
            color="textSecondary"
            gutterBottom
          >
            Language of Reporting
          </Typography>
          {!partner ? (
            <Skeleton width="75%" />
          ) : partner.languageOfReporting.canRead ? (
            partner.languageOfReporting.value ? (
              <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
                <Typography
                  component="li"
                  variant="h4"
                  sx={{ listStyleType: 'none' }}
                >
                  {partner.languageOfReporting.value.name.value}
                </Typography>
              </Stack>
            ) : (
              <Typography component="p" variant="h4">
                None
              </Typography>
            )
          ) : (
            <Redacted
              info="You cannot view this partner's language of reporting"
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
            Language of Wider Communication
          </Typography>
          {!partner ? (
            <Skeleton width="75%" />
          ) : partner.languageOfWiderCommunication.canRead ? (
            partner.languageOfWiderCommunication.value ? (
              <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
                <Typography
                  component="li"
                  variant="h4"
                  sx={{ listStyleType: 'none' }}
                >
                  {partner.languageOfWiderCommunication.value.name.value}
                </Typography>
              </Stack>
            ) : (
              <Typography component="p" variant="h4">
                None
              </Typography>
            )
          ) : (
            <Redacted
              info="You cannot view this partner's language of wider communication"
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
            Languages of Consulting
          </Typography>
          {!partner ? (
            <Skeleton width="75%" />
          ) : partner.languagesOfConsulting.canRead ? (
            partner.languagesOfConsulting.value.length > 0 ? (
              <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
                {partner.languagesOfConsulting.value.map((loc) => (
                  <Typography
                    component="li"
                    variant="h4"
                    sx={{ listStyleType: 'none' }}
                    key={loc.name.value}
                  >
                    {loc.name.value}
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
              info="You cannot view this partner's languages of consulting"
              width="75%"
            />
          )}
        </Box>
      </Stack>
    </ActionableSection>
  );
};
