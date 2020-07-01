import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import * as React from 'react';
import { square } from '../../util';
import { Avatar } from '../Avatar';
import { ButtonLink } from '../Routing';
import { UserListItemFragment } from './UserListItem.generated';

const useStyles = makeStyles(({ spacing, typography }) => ({
  root: {
    maxWidth: 247,
  },
  cardContent: {
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
  cardActions: {
    flexDirection: 'column',
  },
}));

export interface UserListItemCardPortraitProps {
  user?: UserListItemFragment;
  className?: string;
}

export const UserListItemCardPortrait = ({
  user,
  className,
}: UserListItemCardPortraitProps) => {
  const classes = useStyles();

  const org = user?.organizations.items[0];

  return (
    <Card className={clsx(classes.root, className)}>
      <CardContent className={classes.cardContent}>
        <Avatar loading={!user} className={classes.personImage}>
          {user?.avatarLetters}
        </Avatar>
        <Typography variant="h4" className={classes.personName}>
          {!user ? <Skeleton width="100%" /> : user.fullName}
        </Typography>
        <Typography variant="body2" color="primary">
          {!user ? <Skeleton width="100%" /> : org?.name.value}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <ButtonLink disabled={!user} color="primary" to={`/users/${user?.id}`}>
          View Details
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
