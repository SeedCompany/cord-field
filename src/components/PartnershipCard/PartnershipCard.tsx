import {
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { FC } from 'react';
import { displayPartnershipStatus } from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useDateFormatter } from '../Formatters';
import { PartnershipCardFragment } from './PartnershipCard.generated';

const useStyles = makeStyles(({ breakpoints, spacing }) => {
  const cardWidth = breakpoints.values.sm;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
    },
    cardContent: {
      padding: spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
    },
    centerItems: {
      display: 'flex',
      alignItems: 'center',
      marginTop: spacing(2),
    },
    iconSpacing: {
      marginRight: spacing(1),
    },
    leftContent: {
      flex: 1,
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});

export interface PartnershipCardProps {
  partnership?: PartnershipCardFragment;
  className?: string;
}

export const PartnershipCard: FC<PartnershipCardProps> = ({
  partnership,
  className,
}) => {
  const classes = useStyles();
  const dateFormatter = useDateFormatter();

  return (
    <Card className={clsx(className, classes.root)}>
      <CardContent className={classes.cardContent}>
        <Grid
          container
          direction="column"
          spacing={1}
          className={classes.leftContent}
        >
          <Grid item>
            <Typography variant="h4">
              {!partnership ? (
                <Skeleton variant="text" width={'60%'} />
              ) : (
                partnership.organization.name.value
              )}
            </Typography>
          </Grid>
          <Grid item>
            {!partnership ? (
              <Skeleton variant="text" width={'40%'} />
            ) : (
              <Typography>{partnership.types.value.join(', ')}</Typography>
            )}
          </Grid>

          {partnership?.agreementStatus.value && (
            <Grid item>
              <DisplaySimpleProperty
                label="Agreement Status"
                value={displayPartnershipStatus(
                  partnership.agreementStatus.value
                )}
              />
            </Grid>
          )}
          {partnership?.mouStatus.value && (
            <Grid item>
              <DisplaySimpleProperty
                label="Mou Status"
                value={displayPartnershipStatus(partnership.mouStatus.value)}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
      <Divider />
      {partnership && (
        <CardActions className={classes.cardActions}>
          <Button color="primary" disableRipple size="medium">
            Edit
          </Button>
          <DisplaySimpleProperty
            label="Created At"
            value={dateFormatter(partnership.createdAt)}
            ValueProps={{ color: 'textSecondary' }}
          />
        </CardActions>
      )}
    </Card>
  );
};
