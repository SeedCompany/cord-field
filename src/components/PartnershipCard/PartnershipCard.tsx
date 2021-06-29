import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import {
  displayFinancialReportingType,
  displayPartnershipStatus,
} from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDateRange, FormattedDateTime } from '../Formatters';
import { Redacted } from '../Redacted';
import { PartnershipCardFragment } from './PartnershipCard.generated';
import { PartnershipPrimaryIcon } from './PartnershipPrimaryIcon';

const useStyles = makeStyles(({ spacing }) => ({
  loadingName: {
    width: '75%',
  },
  primaryIcon: {
    marginLeft: spacing(1),
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: spacing(2),
  },
}));

export interface PartnershipCardProps {
  partnership?: PartnershipCardFragment;
  onEdit?: () => void;
  className?: string;
}

export const PartnershipCard: FC<PartnershipCardProps> = ({
  partnership,
  onEdit,
  className,
}) => {
  const classes = useStyles();

  const name = partnership?.partner.value?.organization.value?.name.value;
  return (
    <Card className={className}>
      <CardContent>
        <Grid container direction="column" spacing={1}>
          <Grid item container direction="row" alignItems="flex-start">
            <Typography
              variant="h4"
              className={name ? undefined : classes.loadingName}
            >
              {partnership ? (
                name ?? (
                  <Redacted
                    info="You don't have permission to view this partner's name"
                    width="100%"
                  />
                )
              ) : (
                <Skeleton width="100%" />
              )}
            </Typography>
            {partnership?.primary.value ? (
              <PartnershipPrimaryIcon className={classes.primaryIcon} />
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
              value={displayFinancialReportingType(
                partnership?.financialReportingType.value
              )}
              loading={!partnership}
              loadingWidth="40%"
            />
          </Grid>

          <Grid item>
            <DisplaySimpleProperty
              label="Agreement Status"
              value={displayPartnershipStatus(
                partnership?.agreementStatus.value
              )}
              loading={!partnership}
              loadingWidth="50%"
            />
          </Grid>
          <Grid item>
            <DisplaySimpleProperty
              label="MOU Status"
              value={displayPartnershipStatus(partnership?.mouStatus.value)}
              loading={!partnership}
              loadingWidth="40%"
            />
          </Grid>
          <Grid item>
            <DisplaySimpleProperty
              label="MOU Date Range"
              value={<FormattedDateRange range={partnership?.mouRange.value} />}
              loading={!partnership}
              loadingWidth="40%"
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.cardActions}>
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
