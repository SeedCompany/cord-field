import { Edit } from '@mui/icons-material';
import { Stack, Tooltip } from '@mui/material';
import {
  OrganizationReachLabels,
  OrganizationTypeLabels,
} from '~/api/schema.graphql';
import { canEditAny, labelFrom } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';
import { DisplaySecuredList } from './DisplaySecuredList';

interface PartnerTypesSectionProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const AdditionalInformationSection = ({
  partner,
  onEdit,
}: PartnerTypesSectionProps) => {
  const canEdit = canEditAny(
    partner?.organization.value,
    false,
    'types',
    'reach'
  );

  return (
    <ActionableSection
      title="Additional Information"
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
        <DisplaySecuredList
          title="Organizational Types"
          data={partner?.organization.value?.types}
          labelBy={labelFrom(OrganizationTypeLabels)}
          redacted={{ fieldDescription: `organizational types` }}
        />
        <DisplaySecuredList
          title="Partner Reach"
          data={partner?.organization.value?.reach}
          labelBy={labelFrom(OrganizationReachLabels)}
          redacted={{
            fieldDescription: `partner's reach`,
            width: `75%`,
          }}
        />
      </Stack>
    </ActionableSection>
  );
};
