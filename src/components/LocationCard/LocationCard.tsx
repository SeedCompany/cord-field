import {
  Card,
  CardActions,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { displayLocationType } from '../../api';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useDateFormatter } from '../Formatters';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { LocationCardFragment } from './LocationCard.generated';

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      width: '100%',
      maxWidth: 400,
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
    },
    leftContent: {
      '& > *': { marginBottom: spacing(2) },
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});

export interface LocationCardProps {
  className?: string;
  loading?: boolean;
  location?: LocationCardFragment;
}

export const LocationCard: FC<LocationCardProps> = ({
  location,
  className,
  loading,
}) => {
  const { id, name, sensitivity, type, createdAt } = location || {};
  const dateFormatter = useDateFormatter();
  const classes = useStyles();
  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink to={`/locations/${id}`} className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Grid container justify="space-between" spacing={1}>
            <Grid item className={classes.leftContent} xs={8}>
              {loading ? (
                <Skeleton width="75%" />
              ) : (
                <Typography variant="h4">{name?.value}</Typography>
              )}
              <DisplaySimpleProperty
                label="Type"
                value={displayLocationType(type?.value)}
                wrap={(node) => <Grid item>{node}</Grid>}
                loading={loading}
              />
            </Grid>
            {!loading && (
              <Grid item xs={4}>
                <Sensitivity value={sensitivity}></Sensitivity>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </CardActionAreaLink>
      <CardActions className={classes.cardActions}>
        <ButtonLink to={`/locations/${id}`} color="primary" disabled={loading}>
          View Location
        </ButtonLink>
        {loading ? (
          <Skeleton width="25%" />
        ) : (
          <Typography variant="caption" color="textSecondary">
            Created {dateFormatter(createdAt)}
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};
