import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { random } from 'lodash';
import React, { FC } from 'react';
import { CardActionAreaLink } from '../Routing';
import { OrganizationListItemFragment } from './OrganizationListItem.generated';

const useStyles = makeStyles(({ breakpoints, spacing }) => {
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
    skeletonRight: {
      marginLeft: 'auto',
    },
  };
});
export interface OrganizationListItemCardProps {
  organization?: OrganizationListItemFragment;
  className?: string;
}

// min/max is based on production data
const randomNameLength = () => random(3, 50);

export const OrganizationListItemCard: FC<OrganizationListItemCardProps> = ({
  organization,
  className,
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(className, classes.root)}>
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
