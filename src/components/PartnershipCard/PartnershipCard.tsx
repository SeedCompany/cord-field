import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from '@mui/material';
import {
  FinancialReportingTypeLabels,
  PartnershipAgreementStatusLabels,
} from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDateRange, FormattedDateTime } from '../Formatters';
import { Redacted } from '../Redacted';
import { PartnershipCardFragment } from './PartnershipCard.graphql';
import { PartnershipPrimaryIcon } from './PartnershipPrimaryIcon';

export interface PartnershipCardProps {
  partnership?: PartnershipCardFragment;
  onEdit?: () => void;
}

export const PartnershipCard = ({
  partnership,
  onEdit,
}: PartnershipCardProps) => {
  const name = partnership?.partner.value?.organization.value?.name.value;
  return (
    <Card
      sx={{
        flex: 1,
      }}
    >
      <CardContent>
        <Grid container direction="column" spacing={1}>
          <Grid item container direction="row" alignItems="flex-start">
            <Typography variant="h4">
              {partnership ? (
                name ?? (
                  <Redacted
                    info="You don't have permission to view this partner's name"
                    width="100%"
                  />
                )
              ) : (
                <Skeleton width="75%" />
              )}
            </Typography>
            {partnership?.primary.value ? (
              <PartnershipPrimaryIcon sx={{ ml: 1 }} />
            ) : null}
          </Grid>
          <Grid item>
            <Typography>
              {partnership ? (
                partnership.types.value.join(', ')
              ) : (
                <Skeleton width="30%" />
              )}
            </Typography>
          </Grid>
          <Grid item>
            <DisplaySimpleProperty
              label="Financial Reporting Type"
              value={labelFrom(FinancialReportingTypeLabels)(
                partnership?.financialReportingType.value
              )}
              loading={!partnership}
              loadingWidth="40%"
            />
          </Grid>

          <Grid item>
            <DisplaySimpleProperty
              label="Agreement Status"
              value={labelFrom(PartnershipAgreementStatusLabels)(
                partnership?.agreementStatus.value
              )}
              loading={!partnership}
              loadingWidth="50%"
            />
          </Grid>
          <Grid item>
            <DisplaySimpleProperty
              label="MOU Status"
              value={labelFrom(PartnershipAgreementStatusLabels)(
                partnership?.mouStatus.value
              )}
              loading={!partnership}
              loadingWidth="40%"
            />
          </Grid>
          <Grid item>
            <DisplaySimpleProperty
              label="MOU Date Range"
              value={FormattedDateRange.orNull(partnership?.mouRange.value)}
              loading={!partnership}
              loadingWidth="40%"
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pr: 2,
        }}
      >
        <Button color="primary" disabled={!partnership} onClick={onEdit}>
          Edit
        </Button>
        <DisplaySimpleProperty
          label="Created At"
          value={<FormattedDateTime date={partnership?.createdAt} />}
          ValueProps={{ color: 'textSecondary' }}
          loading={!partnership}
          loadingWidth={`${10 + 15}ch`}
        />
      </CardActions>
    </Card>
  );
};
