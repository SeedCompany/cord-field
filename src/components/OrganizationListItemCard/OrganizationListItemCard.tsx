import { Card, CardContent, Grid, Skeleton, Typography } from '@mui/material';
import { random } from 'lodash';
import { makeStyles } from 'tss-react/mui';
import { CardActionAreaLink } from '../Routing';
import { OrganizationListItemFragment } from './OrganizationListItem.graphql';

const useStyles = makeStyles()(({ breakpoints, spacing }) => {
  const cardWidth = breakpoints.values.sm;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
    },
  };
});
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
  const { classes, cx } = useStyles();

  return (
    <Card className={cx(className, classes.root)}>
      <CardActionAreaLink
        disabled={!organization}
        to={`/organizations/${organization?.id}`}
        className={classes.card}
      >
        <CardContent className={classes.cardContent}>
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
