import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { ReactNode } from 'react';
import * as React from 'react';
import { square } from '~/common';
import { Avatar } from '../Avatar';
import { ButtonLink, CardActionAreaLink } from '../Routing';
import { UserListItemFragment } from './UserListItem.graphql';

const useStyles = makeStyles(({ spacing, typography }) => ({
  root: {
    maxWidth: 247,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  actionArea: {
    flex: 1,
    display: 'flex',
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'center',
    padding: spacing(3),
  },
  personImage: {
    alignSelf: 'center',
    ...square(86),
    fontSize: typography.h2.fontSize,
    marginBottom: spacing(2),
  },
  personName: {
    marginBottom: spacing(3),
  },
}));

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
  const classes = useStyles();

  const org = user?.organizations.items[0];

  return (
    <Card className={clsx(classes.root, className)}>
      {content !== undefined ? (
        content
      ) : (
        <CardActionAreaLink
          to={`/users/${user?.id}`}
          disabled={!user}
          className={classes.actionArea}
        >
          <CardContent className={classes.cardContent}>
            <Avatar loading={!user} className={classes.personImage}>
              {user?.avatarLetters}
            </Avatar>
            <Typography variant="h4" className={classes.personName}>
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
