import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import { FC } from 'react';
import { Avatar } from '../Avatar';
import { ButtonLink } from '../Routing';
import { UserListItemFragment } from './UserListItem.generated';

const useStyles = makeStyles(({ palette, spacing }) => ({
  personCard: {
    maxWidth: '247px',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing(3),
  },
  personName: {
    marginBottom: spacing(3),
  },
  personImage: {
    width: '86px',
    height: '86px',
    marginBottom: spacing(2),
  },
  organizationName: {
    marginBottom: spacing(0.25),
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing(2),
    borderTop: `1px solid ${palette.divider}`,
  },
  actionsButton: {
    lineHeight: '1.143',
    padding: 0,
  },
}));

export interface UserListItemCardProps {
  user?: UserListItemFragment;
  className?: string;
}

export const UserListItemCard: FC<UserListItemCardProps> = ({ user }) => {
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
    <Card className={classes.personCard}>
      <CardContent className={classes.cardContent}>
        <Avatar
          loading={!user}
          variant="circle"
          className={classes.personImage}
        >
          {avatarLetters}
        </Avatar>
        <Typography
          color="textPrimary"
          variant="body2"
          className={classes.personName}
        >
          {!user ? <Skeleton variant="text" width="10ch" /> : fullName}
        </Typography>
        <Typography
          color="primary"
          variant="caption"
          className={classes.organizationName}
        >
          {!user ? <Skeleton variant="text" width="10ch" /> : organizationName}
        </Typography>
        <Typography color="textSecondary" variant="caption">
          {!user ? <Skeleton variant="text" width="10ch" /> : role}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <ButtonLink
          disabled={!user}
          color="primary"
          to={`/users/${id}`}
          className={classes.actionsButton}
        >
          View Details
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
