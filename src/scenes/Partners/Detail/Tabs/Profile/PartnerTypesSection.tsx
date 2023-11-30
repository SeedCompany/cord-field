import { Edit } from '@mui/icons-material';
import { Box, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { ReactNode } from 'react';
import {
  FinancialReportingTypeLabels,
  PartnerTypeLabels,
} from '~/api/schema.graphql';
import { canEditAny, labelFrom, SecuredProp, StyleProps } from '~/common';
import { ActionableSection } from '~/components/ActionableSection';
import { IconButton } from '~/components/IconButton';
import { Redacted, RedactedProps } from '~/components/Redacted';
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
      <Stack spacing={2}>
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

const DisplaySecuredList = <T extends string>({
  title,
  data,
  labelBy,
  redacted,
  ...rest
}: {
  title: ReactNode;
  data?: SecuredProp<readonly T[]>;
  labelBy: (value: T) => ReactNode;
  redacted?: Partial<RedactedProps> & { fieldDescription?: string };
} & StyleProps) => (
  <Box {...rest}>
    <Typography
      component="h4"
      variant="body2"
      color="textSecondary"
      gutterBottom
    >
      {title}
    </Typography>
    {!data ? (
      <Skeleton width="75%" />
    ) : data.canRead ? (
      data.value && data.value.length > 0 ? (
        <Stack component="ul" sx={{ m: 0, p: 0, gap: 1 }}>
          {data.value.map((type) => (
            <Typography
              component="li"
              variant="h4"
              sx={{ listStyleType: 'none' }}
              key={type}
            >
              {labelBy(type)}
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
        info={
          redacted?.fieldDescription
            ? `You don't have permission to view the ${redacted.fieldDescription}`
            : `You don't have permission to view this`
        }
        width="100%"
        {...redacted}
      />
    )}
  </Box>
);
