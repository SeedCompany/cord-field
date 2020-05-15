import {
  Avatar,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Group } from '@material-ui/icons';
import { AvatarGroup } from '@material-ui/lab';
import { FC } from 'react';
import * as React from 'react';
import { HugeIcon } from '../Icons';
import { CardActionAreaLink, Link } from '../Routing';

const useStyles = makeStyles(() => ({
  topContent: {
    display: 'flex',
  },
  bottomContent: {
    display: 'flex',
  },
}));

export const MemberListSummary: FC = () => {
  const classes = useStyles();

  return (
    // TODO figure out where this route is supposed to go
    <CardActionAreaLink to="/somewhere">
      <CardContent>
        <Grid container spacing={4}>
          <Grid item>
            <HugeIcon icon={Group} />
          </Grid>
          <Grid item>
            <Typography>Team Members</Typography>
            <Typography variant="h1">12</Typography>
          </Grid>
          {/* TODO figure out where this link is supposed to go */}
          <Grid item>
            <Link to="/somewhere">See All</Link>
          </Grid>
        </Grid>
        <div className={classes.bottomContent}>
          <AvatarGroup max={4}>
            <Avatar alt="someName" src="images/favicon-32x32.png" />
            <Avatar alt="someName" src="images/favicon-32x32.png" />
            <Avatar alt="someName" src="images/favicon-32x32.png" />
            <Avatar alt="someName" src="images/favicon-32x32.png" />
            <Avatar alt="someName" src="images/favicon-32x32.png" />
            <Avatar alt="someName" src="images/favicon-32x32.png" />
            <Avatar alt="someName" src="images/favicon-32x32.png" />
          </AvatarGroup>
          {/* TODO figure out if this is supposed to be link that goes
          somewhere and what text is supposed to be */}
          <Link to="/somewhere">
            You, Tyler, Vanessa
            <br />& 8 others
          </Link>
        </div>
      </CardContent>
    </CardActionAreaLink>
  );
};
