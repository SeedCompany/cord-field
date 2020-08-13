import {
  Card,
  IconButton,
  makeStyles,
  MenuProps,
  Typography,
} from '@material-ui/core';
import { AccountCircle, MoreVert, NotificationsNone } from '@material-ui/icons';
import { FC, useState } from 'react';
import * as React from 'react';
import { useSession } from '../../../../components/Session';
import { ProfileMenu } from '../ProfileMenu';
import { UserActionsMenu } from '../UserActionsMenu';

const useStyles = makeStyles(({ typography, spacing }) => ({
  card: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: spacing(1),
  },
  name: {
    fontWeight: typography.weight.medium,
    margin: spacing(0, 1, 0, 2),
  },
}));

export const ProfileToolbar: FC = () => {
  const classes = useStyles();
  const [session] = useSession();
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <Card className={classes.card}>
        <Typography className={classes.name} color="primary">
          Hi, {session?.realFirstName.value ?? 'Friend'}
        </Typography>
        <IconButton
          color="secondary"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={(e) => setProfileAnchor(e.currentTarget)}
        >
          <AccountCircle />
        </IconButton>
        <IconButton>
          <NotificationsNone />
        </IconButton>
        <IconButton onClick={(e) => setActionsAnchor(e.currentTarget)}>
          <MoreVert />
        </IconButton>
      </Card>
      <ProfileMenu
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
      />
      <UserActionsMenu
        anchorEl={actionsAnchor}
        onClose={() => setActionsAnchor(null)}
      />
    </>
  );
};
