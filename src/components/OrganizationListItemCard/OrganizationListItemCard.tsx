import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { random } from 'lodash';
import { CardActionAreaLink } from '../Routing';
import { OrganizationListItemFragment } from './OrganizationListItem.graphql';

export interface OrganizationListItemCardProps {
  organization?: OrganizationListItemFragment;
  className?: string;
}

// min/max is based on production data
const randomNameLength = () => random(3, 50);

export const OrganizationListItemCard = ({
  organization,
  className,
}: OrganizationListItemCardProps) => {
  return (
    <Card
      className={className}
      sx={(theme) => ({
        width: '100%',
        maxWidth: theme.breakpoints.values.sm,
      })}
    >
      <CardActionAreaLink
        disabled={!organization}
        to={`/organizations/${organization?.id}`}
        sx={{ display: 'flex', alignItems: 'initial' }}
      >
        <CardContent
          sx={{
            flex: 1,
            py: 2,
            px: 3,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h4">
                {!organization ? (
                  <Skeleton variant="text" width={`${randomNameLength()}ch`} />
                ) : (
                  organization.name.value
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
