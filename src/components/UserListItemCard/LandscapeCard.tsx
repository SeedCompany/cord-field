import { Card, CardContent, Skeleton, Typography } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { PartialDeep } from 'type-fest';
import { square } from '~/common';
import { UsersQueryVariables } from '../../scenes/Users/List/users.graphql';
import { Avatar } from '../Avatar';
import { CardActionAreaLink } from '../Routing';
import { TogglePinButton } from '../TogglePinButton';
import { UserListItemFragment } from './UserListItem.graphql';

const useStyles = makeStyles()(({ breakpoints, spacing, typography }) => ({
  root: {
    flex: 1,
    maxWidth: breakpoints.values.sm,
    position: 'relative',
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
  pin: {
    position: 'absolute',
    top: 10,
    right: 10,
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
  const { classes, cx } = useStyles();

  const org = user?.organizations.items[0];

  return (
    <Card className={cx(classes.root, className)}>
      <CardActionAreaLink disabled={!user} to={`/users/${user?.id}`}>
        <CardContent className={classes.content}>
          <Avatar loading={!user} className={classes.avatar}>
            {user?.avatarLetters}
          </Avatar>
          <div className={classes.userInfo}>
            <Typography variant="h4" paragraph>
              {!user ? (
                <Skeleton width="75%" />
              ) : (
                `${user.displayFirstName.value} ${user.displayLastName.value}`
              )}
            </Typography>
            <Typography variant="body2" color="primary">
              {!user ? <Skeleton width="50%" /> : org?.name.value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {!user ? <Skeleton width="50%" /> : user.title.value}
            </Typography>
          </div>
        </CardContent>
      </CardActionAreaLink>
      <TogglePinButton
        object={user}
        label="Person"
        listId="users"
        listFilter={(args: PartialDeep<UsersQueryVariables>) =>
          args.input?.filter?.pinned ?? false
        }
        className={classes.pin}
      />
    </Card>
  );
};
