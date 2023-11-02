import { Grid, Skeleton, Typography } from '@mui/material';
import {
  FinancialReportingTypeLabels,
  PartnerTypeLabels,
} from '~/api/schema.graphql';
import { canEditAny } from '~/common';
import { EditableSection } from '~/components/EditableSection';
import { Redacted } from '~/components/Redacted';
import { PartnerDetailsFragment } from '../../PartnerDetail.graphql';

interface PartnerTypesCardProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const PartnerTypesSection = ({
  partner,
  onEdit,
}: PartnerTypesCardProps) => {
  const canEdit = canEditAny(
    partner,
    false,
    'types',
    'financialReportingTypes'
  );

  return (
    <section>
      <EditableSection
        canEdit={canEdit}
        title="Partner Type"
        tooltipTitle="Edit Address"
        onEdit={onEdit}
        loading={!partner}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Role
            </Typography>
            {!partner ? (
              <Skeleton width="75%" />
            ) : partner.types.canRead ? (
              partner.types.value.length > 0 ? (
                partner.types.value.map((type, index) => (
                  <Typography key={index} variant="h4" sx={{ mb: 1 }}>
                    {PartnerTypeLabels[type]}
                  </Typography>
                ))
              ) : (
                <Typography variant="h4">None</Typography>
              )
            ) : (
              <Redacted
                info="You don't have permission to view the partner's types"
                width="100%"
              />
            )}
          </Grid>

          {partner &&
          (partner.financialReportingTypes.value.length ||
            !partner.financialReportingTypes.canRead) ? (
            <Grid item>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Financial Reporting Types
              </Typography>
              {partner.financialReportingTypes.canRead ? (
                partner.financialReportingTypes.value.length > 0 ? (
                  partner.financialReportingTypes.value.map((type, index) => (
                    <Typography key={index} variant="h4" sx={{ mb: 1 }}>
                      {FinancialReportingTypeLabels[type]}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="h4">None</Typography>
                )
              ) : (
                <Redacted
                  info="You don't have permission to view the partner's financial reporting types"
                  width="75%"
                />
              )}
            </Grid>
          ) : null}
        </Grid>
      </EditableSection>
    </section>
  );
};
