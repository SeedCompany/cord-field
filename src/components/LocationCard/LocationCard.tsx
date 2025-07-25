import {
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { LocationTypeLabels } from '~/api/schema.graphql';
import { labelFrom } from '~/common';
import { FormattedDateTime } from '../Formatters';
import { ProgressButton } from '../ProgressButton';
import { Redacted } from '../Redacted';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { LocationCardFragment } from './LocationCard.graphql';

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
  return (
    <Card className={className} sx={{ width: '100%', maxWidth: 400 }}>
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
      <CardActions sx={{ justifyContent: 'space-between' }}>
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
            sx={{
              pr: 1,
            }}
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
