import { Edit } from '@mui/icons-material';
import { Stack, Tooltip } from '@mui/material';
import { canEditAny } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { DisplaySecuredList } from '~/components/DisplaySecuredList/DisplaySecuredList';
import { IconButton } from '~/components/IconButton';
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
  const canEditLanguagesOfConsulting = canEditAny(
    partner,
    false,
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
              disabled={!canEditLanguagesOfConsulting}
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
      <Stack spacing={2}>
        <DisplaySecuredList
          title="Language of Consulting"
          data={partner?.languagesOfConsulting}
          redacted={{ fieldDescription: `partner's communications` }}
          keyGetter={(item) => {
            console.log();
            return item.name.value || '';
          }}
        />
      </Stack>
    </ActionableSection>
  );
};
