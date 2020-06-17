import { Card, CardContent, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import { FC } from 'react';
import { Avatar } from '../Avatar';
import { CardActionAreaLink } from '../Routing';
import { UserListItemFragment } from './UserListItem.generated';

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
  avatar: {
    width: '86px',
    height: '86px',
    marginBottom: spacing(1),
    marginRight: spacing(1),
  },
  userInfo: {
    padding: `${spacing(2)}px ${spacing(3)}px`,
  },
  userName: {
    marginBottom: spacing(1.5),
  },
  userOrg: {
    fontSize: typography.h6.fontSize,
    marginBottom: spacing(1),
  },
  userRole: {
    fontSize: typography.body1.fontSize,
  },
}));

interface UserListItemCardLandscapeProps {
  className?: string;
  user?: UserListItemFragment;
}

export const UserListItemCardLandscape: FC<UserListItemCardLandscapeProps> = (
  props
) => {
  const { className, user } = props;
  const classes = useStyles();

  const { fullName, id } = user ?? { fullName: '', id: '' };

  // TODO destructure from user when this data becomes queryable
  const fullNameParts = fullName ? fullName.split(' ') : ['Unknown'];
  const avatarLetters = fullNameParts.reduce(
    (initials, part) => initials.concat(part.slice(0, 1).toUpperCase()),
    ''
  );
  const organization = {
    name: 'Seed Company',
    role: 'Software Developer',
  };
  const { name: organizationName, role } = organization;

  return (
    <Card className={`${className} ${classes.root}`}>
      <CardActionAreaLink
        disabled={!user}
        to={user ? `/users/${id}` : ''}
        className={classes.cardActionArea}
      >
        <CardContent className={classes.cardHeader}>
          <Avatar loading={!user} variant="circle" className={classes.avatar}>
            {avatarLetters}
          </Avatar>
        </CardContent>
        <CardContent className={classes.userInfo}>
          <Typography
            color="textPrimary"
            variant="h3"
            className={classes.userName}
          >
            {!user ? <Skeleton variant="text" width="10ch" /> : fullName}
          </Typography>
          <Typography
            color="primary"
            variant="body2"
            className={classes.userOrg}
          >
            {!user ? (
              <Skeleton variant="text" width="10ch" />
            ) : (
              organizationName
            )}
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
            className={classes.userRole}
          >
            {!user ? <Skeleton variant="text" width="10ch" /> : role}
          </Typography>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
