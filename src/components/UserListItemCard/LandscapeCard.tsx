import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import { PartialDeep } from 'type-fest';
import { square } from '~/common';
import { UsersQueryVariables } from '../../scenes/Users/List/users.graphql';
import { Avatar } from '../Avatar';
import { CardActionAreaLink } from '../Routing';
import { TogglePinButton } from '../TogglePinButton';
import { UserListItemFragment } from './UserListItem.graphql';

interface UserListItemCardLandscapeProps {
  className?: string;
  user?: UserListItemFragment;
}

export const UserListItemCardLandscape = ({
  user,
  className,
}: UserListItemCardLandscapeProps) => {
  const org = user?.organizations.items[0];

  return (
    <Card
      className={className}
      sx={(theme) => ({
        flex: 1,
        maxWidth: theme.breakpoints.values.sm,
        position: 'relative',
      })}
    >
      <CardActionAreaLink disabled={!user} to={`/users/${user?.id}`}>
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            loading={!user}
            sx={(theme) => ({
              ...square(theme.spacing(8)),
              fontSize: theme.typography.h3.fontSize,
              marginRight: theme.spacing(3),
            })}
          >
            {user?.avatarLetters}
          </Avatar>
          <Box
            sx={{
              flex: 1,
            }}
          >
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
          </Box>
        </CardContent>
      </CardActionAreaLink>
      <TogglePinButton
        object={user}
        label="Person"
        listId="users"
        listFilter={(args: PartialDeep<UsersQueryVariables>) =>
          args.input?.filter?.pinned ?? false
        }
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      />
    </Card>
  );
};
