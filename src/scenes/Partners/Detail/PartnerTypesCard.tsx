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
import { PartnerDetailsFragment } from './PartnerDetail.generated';

const useStyles = makeStyles(({ spacing }) => ({
  cardContent: {
    flexGrow: 1,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: spacing(2),
  },
}));

interface PartnerTypeCardProps {
  partner?: PartnerDetailsFragment;
  onEdit: () => void;
  className?: string;
}

export const PartnerTypeCard: FC<PartnerTypeCardProps> = ({
  partner,
  className,
  onEdit,
}) => {
  const classes = useStyles();

  return (
    <Card className={className}>
      <CardContent className={classes.cardContent}>
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Typography variant="h4">
              {partner ? (
                partner.types.value.join(', ')
              ) : (
                <Skeleton width="75%" />
              )}
            </Typography>
          </Grid>

          {partner?.types.value.includes('Managing') && (
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                Financial Reporting Type
              </Typography>
              <Typography variant="h4">
                {partner.financialReportingTypes.value.join(', ')}
              </Typography>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button color="primary" disabled={!partner} onClick={onEdit}>
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
