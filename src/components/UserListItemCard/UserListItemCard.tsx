import {
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from '@material-ui/core';
import * as React from 'react';
import { FC } from 'react';
import { Avatar } from '../Avatar';
import { ButtonLink } from '../Routing';
import { UserListItemFragment } from './UserListItem.generated';

const useStyles = makeStyles(({ palette, spacing }) => ({
  personCard: {
    maxWidth: '247px',
    paddingTop: spacing(1),
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  personName: {
    paddingBottom: spacing(0.5),
  },
  personImage: {
    width: '86px',
    height: '86px',
    paddingBottom: spacing(2),
  },
  roleName: {
    marginBottom: spacing(1),
  },
  organizationName: {
    marginBottom: spacing(0.25),
  },
  statusCircle: {
    height: '8px',
    width: '8px',
    marginRight: spacing(1),
    borderRadius: '50%',
    display: 'inline-block',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing(2),
    border: `1px solid ${palette.grey[300]}`,
  },
  activeColor: {
    backgroundColor: '#619a55',
  },
  notActiveColor: {
    backgroundColor: palette.action.disabled,
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
  const avatarLetters = 'images/favicon-32x32.png';
  const organization = {
    name: 'Seed Company',
    role: 'Software Developer',
  };
  const { name: organizationName, role } = organization;

  return (
    <Card className={classes.personCard}>
      <CardContent className={classes.cardContent}>
        <Avatar
          variant="circle"
          alt={fullName ?? ''}
          src={avatarLetters}
          className={classes.personImage}
        />
        <Typography
          color="textPrimary"
          variant="body2"
          className={classes.personName}
        >
          {fullName}
        </Typography>
        <Typography
          color="primary"
          variant="caption"
          className={classes.organizationName}
        >
          {organizationName}
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
          className={classes.roleName}
        >
          {role}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <ButtonLink color="primary" to={`/users/${id}`}>
          View Details
        </ButtonLink>
      </CardActions>
    </Card>
  );
};
