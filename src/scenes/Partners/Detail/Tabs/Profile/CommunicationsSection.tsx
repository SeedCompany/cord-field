import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { DisplaySecuredList } from '~/components/DisplaySecuredList/DisplaySecuredList';
import { IconButton } from '~/components/IconButton';
import { Redacted } from '~/components/Redacted';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface CommunicationsSectionProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}
export const CommunicationsSection = ({
  partner,
  onEdit,
}: CommunicationsSectionProps) => {
  const canEditLanguages = canEditAny(
    partner,
    false,
    'languagesOfConsulting',
    'languageOfWiderCommunication',
    'languageOfReporting'
  );

  return (
    <ActionableSection
      title="Communications"
      loading={!partner}
      action={
        <Tooltip title="Edit">
          <span>
            <IconButton
              disabled={!canEditLanguages}
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
      <Stack spacing={18} direction="row">
        <DisplaySecuredList
          title="Language of Consulting"
          data={partner?.languagesOfConsulting}
          redacted={{ fieldDescription: `partner's communications` }}
          keyGetter={(item) => {
            return item.name.value || '';
          }}
        />
        <Box>
          <Typography
            component="h4"
            variant="body2"
            color="textSecondary"
            gutterBottom
          >
            Language of Wider Communication
          </Typography>
          <Typography component="div" variant="h4">
            {!partner ? (
              <Skeleton width="75%" />
            ) : !partner.languageOfWiderCommunication.canRead ? (
              <Redacted
                info="You cannot view this partner's Language of Wider Communication"
                width="75%"
              />
            ) : partner.languageOfWiderCommunication.value ? (
              partner.languageOfWiderCommunication.value.name.value
            ) : (
              <Typography variant="h4">None</Typography>
            )}
          </Typography>
        </Box>
        <Box>
          <Typography
            component="h4"
            variant="body2"
            color="textSecondary"
            gutterBottom
          >
            Language of Reporting
          </Typography>
          <Typography component="div" variant="h4">
            {!partner ? (
              <Skeleton width="75%" />
            ) : !partner.languageOfReporting.canRead ? (
              <Redacted
                info="You cannot view this partner's Language of Wider Communication"
                width="75%"
              />
            ) : partner.languageOfReporting.value ? (
              partner.languageOfReporting.value.name.value
            ) : (
              <Typography variant="h4">None</Typography>
            )}
          </Typography>
        </Box>
      </Stack>
    </ActionableSection>
  );
};
