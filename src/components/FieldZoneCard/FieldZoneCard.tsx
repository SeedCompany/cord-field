import {
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { FormattedDateTime } from '../Formatters';
import { Redacted } from '../Redacted';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { FieldZoneCardFragment } from './FieldZoneCard.graphql';

export interface FieldZoneCardProps {
  loading?: boolean;
  fieldZone?: FieldZoneCardFragment;
}

export const FieldZoneCard = ({ fieldZone, loading }: FieldZoneCardProps) => {
  const { id, name, createdAt } = fieldZone ?? {};
  return (
    <Card sx={{ width: '100%', maxWidth: 400 }}>
      <CardActionAreaLink to={`/field-zones/${id}`}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {loading ? (
              <Skeleton width="75%" />
            ) : name?.canRead === true ? (
              name.value
            ) : (
              <Redacted
                info="You don't have permission to view this field zone's name"
                width="75%"
              />
            )}
          </Typography>
        </CardContent>
      </CardActionAreaLink>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <ButtonLink
          to={`/field-zones/${id}`}
          color="primary"
          disabled={loading}
        >
          View Field Zone
        </ButtonLink>
        <Typography
          variant="caption"
          color="textSecondary"
          sx={(theme) => ({
            pr: theme.spacing(1),
          })}
        >
          {loading ? (
            <Skeleton width="25%" />
          ) : (
            <>
              Created <FormattedDateTime date={createdAt} />
            </>
          )}
        </Typography>
      </CardActions>
    </Card>
  );
};
