import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { displayLocationType } from '../../api';
import { FormattedDateTime } from '../Formatters';
import { Redacted } from '../Redacted';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { LocationCardFragment } from './LocationCard.generated';

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      width: '100%',
      maxWidth: 400,
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'space-between',
      paddingRight: spacing(2), // make symmetrical with button padding
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
  const { id, name, locationType, createdAt } = location ?? {};
  const classes = useStyles();
  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink to={`/locations/${id}`}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {loading ? (
              <Skeleton width="75%" />
            ) : name?.canRead === true ? (
              name.value
            ) : (
              <Redacted
                info="You don't have permission to view this location's name"
                width="75%"
              />
            )}
          </Typography>
          <Typography color="textSecondary">
            {loading ? (
              <Skeleton width="25%" />
            ) : locationType?.canRead === true ? (
              displayLocationType(locationType.value)
            ) : (
              <Redacted
                info="You don't have permission to view this location's type"
                width="25%"
              />
            )}
          </Typography>
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
            Created <FormattedDateTime date={createdAt} />
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};
