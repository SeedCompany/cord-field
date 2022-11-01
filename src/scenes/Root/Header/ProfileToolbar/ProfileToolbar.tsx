import {
  AccountCircle,
  MoreVert,
  NotificationsNone,
} from '@mui/icons-material';
import { Card, IconButton, MenuProps, Typography } from '@mui/material';
import { useState } from 'react';
import { useSession } from '../../../../components/Session';
import { ProfileMenu } from '../ProfileMenu';
import { UserActionsMenu } from '../UserActionsMenu';

export const ProfileToolbar = () => {
  const { session } = useSession();
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <Card
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          p: 1,
        }}
      >
        <Typography
          color="primary"
          sx={{
            fontWeight: 'medium',
            my: 0,
            mr: 1,
            ml: 2,
          }}
        >
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
