import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import { FC } from 'react';
import { Avatar } from '../Avatar';
import { CardActionAreaLink } from '../Routing';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
  root: {
    flex: 1,
    width: '576px',
  },
  cardActionArea: {
    display: 'flex',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRight: `0.5px solid ${palette.divider}`,
    height: '100%',
    padding: spacing(4),
  },
  personImage: {
    width: '86px',
    height: '86px',
    marginBottom: spacing(1),
    marginRight: spacing(1),
  },
  projectInfo: {
    padding: `${spacing(2)}px ${spacing(3)}px`,
  },
  projectName: {
    fontSize: typography.h4.fontSize,
    marginBottom: spacing(1),
  },
  projectLocation: {},
  userProjects: {
    alignSelf: 'center',
    marginLeft: 'auto',
    padding: `${spacing(4)}px ${spacing(2)}px`,
    textAlign: 'right',
  },
  projectNumber: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '1px',
  },
  activeProjects: {
    lineHeight: 1.07,
    marginBottom: spacing(2),
  },
}));

interface UserListItemCardLandscapeProps {
  className?: string;
  user?: {
    id: string;
    avatarLetters: string;
    project: {
      name: string;
      location: string;
    };
    activeProjects: number;
  };
}

export const UserListItemCardLandscape: FC<UserListItemCardLandscapeProps> = (
  props
) => {
  const { user } = props;
  const classes = useStyles();

  const {
    id,
    avatarLetters,
    project: { name: projectName, location: projectLocation },
    activeProjects,
  } = user ?? {
    id: '',
    avatarLetters: '',
    project: {
      name: '',
      location: '',
    },
    activeProjects: 0,
  };

  return (
    <Card className={classes.root}>
      <CardActionAreaLink
        disabled={!user}
        to={user ? `/users/${id}` : ''}
        className={classes.cardActionArea}
      >
        <CardContent className={classes.cardHeader}>
          <Avatar
            loading={!user}
            variant="circle"
            className={classes.personImage}
          >
            {avatarLetters}
          </Avatar>
        </CardContent>
        <CardContent className={classes.projectInfo}>
          <Typography
            color="textPrimary"
            variant="h3"
            className={classes.projectName}
          >
            {!user ? <Skeleton variant="text" width="10ch" /> : projectName}
          </Typography>
          <Typography
            color="primary"
            variant="body2"
            className={classes.projectLocation}
          >
            {!user ? <Skeleton variant="text" width="10ch" /> : projectLocation}
          </Typography>
        </CardContent>
        <CardContent className={classes.userProjects}>
          <Typography
            variant="h1"
            component="span"
            className={classes.projectNumber}
          >
            {!user ? <Skeleton /> : activeProjects}
          </Typography>
          <Typography
            className={classes.activeProjects}
            color="primary"
            component="span"
            variant="body2"
          >
            {!user ? <Skeleton width="3ch" /> : <>Active Projects</>}
          </Typography>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
