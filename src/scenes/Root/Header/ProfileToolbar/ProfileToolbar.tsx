import { AccountCircle, SupervisedUserCircle } from '@mui/icons-material';
import { IconButton, MenuProps, Stack, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { Feature } from '~/components/Feature';
import { NotificationCenter } from '~/components/NotificationsCenter/NotificationsCenter';
import { useSession } from '~/components/Session';
import { ProfileMenu } from '../ProfileMenu';

export const ProfileToolbar = () => {
  const { session } = useSession();
  const impersonation = useContext(ImpersonationContext);
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Wrapping with FF here to avoid API call */}
        <Feature flag="notifications" match>
          <NotificationCenter />
        </Feature>
        <Typography color="primary" sx={{ fontWeight: 'medium' }}>
          {session?.fullName}
        </Typography>
        <IconButton
          color="secondary"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={(e) => setProfileAnchor(e.currentTarget)}
        >
          {impersonation.enabled ? <SupervisedUserCircle /> : <AccountCircle />}
        </IconButton>
      </Stack>
      <ProfileMenu
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
      />
    </>
  );
};
