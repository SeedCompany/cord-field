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
import { FieldRegionCardFragment } from './FieldRegionCard.graphql';

export interface FieldRegionCardProps {
  loading?: boolean;
  fieldRegion?: FieldRegionCardFragment;
}

export const FieldRegionCard = ({
  fieldRegion,
  loading,
}: FieldRegionCardProps) => {
  const { id, name, director } = fieldRegion ?? {};
  return (
    <Card sx={{ width: '100%', maxWidth: 400 }}>
      <CardActionAreaLink to={`/field-regions/${id}`}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {loading ? (
              <Skeleton width="75%" />
            ) : name?.canRead === true ? (
              name.value
            ) : (
              <Redacted
                info="You don't have permission to view this field region's name"
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
              info="You don't have permission to view this field region's director"
              width="75%"
            />
          )}
        </CardContent>
      </CardActionAreaLink>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <ButtonLink
          to={`/field-regions/${id}`}
          color="primary"
          disabled={loading}
        >
          View Field Region
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
