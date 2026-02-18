import {
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { Redacted } from '../Redacted';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { FieldZoneCardFragment } from './FieldZoneCard.graphql';

export interface FieldZoneCardProps {
  loading?: boolean;
  fieldZone?: FieldZoneCardFragment;
}

export const FieldZoneCard = ({ fieldZone, loading }: FieldZoneCardProps) => {
  const { id, name, director } = fieldZone ?? {};
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
          {loading ? (
            <Skeleton width="75%" />
          ) : director?.canRead === true ? (
            <DisplaySimpleProperty
              LabelProps={{ color: 'textSecondary' }}
              label="Director"
              value={director.value?.fullName}
              loading={!director}
              loadingWidth="25%"
            />
          ) : (
            <Redacted
              info="You don't have permission to view this field zone's director"
              width="75%"
            />
          )}
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
      </CardActions>
    </Card>
  );
};
