import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import * as React from 'react';
import { square } from '../../util';
import { Avatar } from '../Avatar';
import { CardActionAreaLink } from '../Routing';
import { UserListItemFragment } from './UserListItem.generated';

const useStyles = makeStyles(({ breakpoints, spacing, typography }) => ({
  root: {
    flex: 1,
    maxWidth: breakpoints.values.sm,
  },
  content: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    ...square(spacing(8)),
    fontSize: typography.h3.fontSize,
    marginRight: spacing(3),
  },
  userInfo: {
    flex: 1,
  },
}));

interface UserListItemCardLandscapeProps {
  className?: string;
  user?: UserListItemFragment;
}

export const UserListItemCardLandscape = ({
  user,
  className,
}: UserListItemCardLandscapeProps) => {
  const classes = useStyles();

  const org = user?.organizations.items[0];

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink disabled={!user} to={`/users/${user?.id}`}>
        <CardContent className={classes.content}>
          <Avatar loading={!user} className={classes.avatar}>
            {user?.avatarLetters}
          </Avatar>
          <div className={classes.userInfo}>
            <Typography variant="h4" paragraph>
              {!user ? <Skeleton width="75%" /> : user.fullName}
            </Typography>
            <Typography variant="body2" color="primary">
              {!user ? <Skeleton width="50%" /> : org?.name.value}
            </Typography>
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
