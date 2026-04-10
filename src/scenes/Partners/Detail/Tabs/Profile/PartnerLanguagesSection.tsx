import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
import { Redacted } from '~/components/Redacted';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface PartnerLanguagesSectionProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
}

export const PartnerLanguagesSection = ({
  partner,
  onEdit,
}: PartnerLanguagesSectionProps) => {
  const canEdit = canEditAny(
    partner,
    false,
    'languageOfReporting',
    'languageOfWiderCommunication',
    'languagesOfConsulting'
  );

  return (
    <ActionableSection
      title="Languages"
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
      <Stack direction="row" columnGap={6} rowGap={3} flexWrap="wrap">
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
            <Skeleton width="120px" />
          ) : partner.languageOfReporting.canRead ? (
            <Typography component="p" variant="h4">
              {partner.languageOfReporting.value
                ? partner.languageOfReporting.value.publicName
                : 'None'}
            </Typography>
          ) : (
            <Redacted
              info="You cannot view this partner's language of reporting"
              width="120px"
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
            <Skeleton width="120px" />
          ) : partner.languageOfWiderCommunication.canRead ? (
            <Typography component="p" variant="h4">
              {partner.languageOfWiderCommunication.value
                ? partner.languageOfWiderCommunication.value.publicName
                : 'None'}
            </Typography>
          ) : (
            <Redacted
              info="You cannot view this partner's language of wider communication"
              width="120px"
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
            <Skeleton width="120px" />
          ) : partner.languagesOfConsulting.canRead ? (
            partner.languagesOfConsulting.value.length > 0 ? (
              <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
                {partner.languagesOfConsulting.value.map((language) => (
                  <Typography
                    component="li"
                    variant="h4"
                    sx={{ listStyleType: 'none' }}
                    key={language.id}
                  >
                    {language.publicName}
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
              width="120px"
            />
          )}
        </Box>
      </Stack>
    </ActionableSection>
  );
};
