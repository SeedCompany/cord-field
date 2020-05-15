import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import React, { FC } from 'react';
import { Picture, useRandomPicture } from '../Picture';
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
    media: {
      width: cardWidth / 3,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
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

export const OrganizationListItemCard: FC<OrganizationListItemCardProps> = ({
  organization,
  className,
}) => {
  const classes = useStyles();
  const pic = useRandomPicture({
    seed: organization?.id,
    width: 300,
    height: 200,
  });

  return (
    <Card className={clsx(className, classes.root)}>
      <CardActionAreaLink
        disabled={!organization}
        to={`/organizations/${organization?.id}`}
        className={classes.card}
      >
        <div className={classes.media}>
          {!organization ? (
            <Skeleton variant="rect" height={200} />
          ) : (
            <Picture fit="cover" {...pic} />
          )}
        </div>
        <CardContent className={classes.cardContent}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography variant="h4">
                {!organization ? (
                  <Skeleton variant="text" />
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
