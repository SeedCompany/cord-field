import {
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { square } from '~/common';
import { Avatar } from '../Avatar';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { UserListItemFragment } from './UserListItem.graphql';

export interface UserListItemCardPortraitProps {
  user?: UserListItemFragment;
  className?: string;
  content?: ReactNode;
  action?: ReactNode;
}

export const UserListItemCardPortrait = ({
  user,
  className,
  content,
  action,
}: UserListItemCardPortraitProps) => {
  const org = user?.organizations.items[0];

  return (
    <Card
      className={className}
      sx={{
        maxWidth: 247,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {content !== undefined ? (
        content
      ) : (
        <CardActionAreaLink
          to={`/users/${user?.id}`}
          disabled={!user}
          sx={{
            flex: 1,
            display: 'flex',
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              textAlign: 'center',
              p: 3,
            }}
          >
            <Avatar
              loading={!user}
              sx={{
                alignSelf: 'center',
                ...square(86),
                fontSize: 'h2.fontSize',
                mb: 2,
              }}
            >
              {user?.avatarLetters}
            </Avatar>
            <Typography variant="h4" sx={{ mb: 3 }}>
              {!user ? (
                <Skeleton width="100%" />
              ) : (
                `${user.displayFirstName.value} ${user.displayLastName.value}`
              )}
            </Typography>
            <Typography variant="body2" color="primary">
              {!user ? <Skeleton width="100%" /> : org?.name.value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {!user ? <Skeleton width="100%" /> : user.title.value}
            </Typography>
          </CardContent>
        </CardActionAreaLink>
      )}
      <CardActions>
        {action !== undefined ? (
          action
        ) : (
          <ButtonLink
            disabled={!user}
            color="primary"
            to={`/users/${user?.id}`}
          >
            View Details
          </ButtonLink>
        )}
      </CardActions>
    </Card>
  );
};
