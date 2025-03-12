import { Edit } from '@mui/icons-material';
import { Stack, Tooltip } from '@mui/material';
import {
  FinancialReportingTypeLabels,
  PartnerTypeLabels,
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
      <Stack
        direction="row"
        columnGap={4}
        rowGap={3}
        justifyContent="space-between"
        flexWrap="wrap"
        maxWidth={350}
      >
        <DisplaySecuredList
          title="Roles"
          data={partner?.types}
          labelBy={labelFrom(PartnerTypeLabels)}
          redacted={{ fieldDescription: `partner's roles` }}
        />
        <DisplaySecuredList
          title="Financial Reporting Types"
          data={partner?.financialReportingTypes}
          labelBy={labelFrom(FinancialReportingTypeLabels)}
          redacted={{
            fieldDescription: `partner's financial reporting types`,
            width: '75%',
          }}
        />
      </Stack>
    </ActionableSection>
  );
};
