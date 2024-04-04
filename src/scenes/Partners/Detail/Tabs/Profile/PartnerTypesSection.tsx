import { Edit } from '@mui/icons-material';
import { Stack, Tooltip } from '@mui/material';
import {
  FinancialReportingTypeLabels,
  PartnerTypeLabels,
} from '~/api/schema.graphql';
import { canEditAny, labelFrom } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { DisplaySecuredList } from '~/components/DisplaySecuredList/DisplaySecuredList';
import { IconButton } from '~/components/IconButton';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface PartnerTypesSectionProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const PartnerTypesSection = ({
  partner,
  onEdit,
}: PartnerTypesSectionProps) => {
  const canEdit = canEditAny(
    partner,
    false,
    'types',
    'financialReportingTypes'
  );

  return (
    <ActionableSection
      title="Partner Type"
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
      <Stack spacing={2}>
        <DisplaySecuredList
          title="Roles"
          data={partner?.types}
          keyGetter={labelFrom(PartnerTypeLabels)}
          redacted={{ fieldDescription: `partner's roles` }}
        />
        <DisplaySecuredList
          title="Financial Reporting Types"
          data={partner?.financialReportingTypes}
          keyGetter={labelFrom(FinancialReportingTypeLabels)}
          redacted={{
            fieldDescription: `partner's financial reporting types`,
            width: '75%',
          }}
        />
      </Stack>
    </ActionableSection>
  );
};
