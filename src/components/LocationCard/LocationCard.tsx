import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Skeleton,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import { LocationTypeLabels } from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { FormattedDateTime } from '../Formatters';
import { ProgressButton } from '../ProgressButton';
import { Redacted } from '../Redacted';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { LocationCardFragment } from './LocationCard.graphql';

const useStyles = makeStyles(({ spacing }) => {
  return {
    root: {
      width: '100%',
      maxWidth: 400,
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    createdAt: {
      paddingRight: spacing(1), // make symmetrical with button padding
    },
  };
});

export interface LocationCardProps {
  className?: string;
  loading?: boolean;
  location?: LocationCardFragment;
  onRemove?: () => void;
  removing?: boolean;
}

export const LocationCard = ({
  location,
  className,
  loading,
  onRemove,
  removing,
}: LocationCardProps) => {
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
              labelFrom(LocationTypeLabels)(locationType.value)
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
        {onRemove ? (
          <ProgressButton
            disabled={loading}
            onClick={onRemove}
            color="error"
            progress={removing}
          >
            Remove
          </ProgressButton>
        ) : (
          <Typography
            variant="caption"
            color="textSecondary"
            className={classes.createdAt}
          >
            {loading ? (
              <Skeleton width="25%" />
            ) : (
              <>
                Created <FormattedDateTime date={createdAt} />
              </>
            )}
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};
