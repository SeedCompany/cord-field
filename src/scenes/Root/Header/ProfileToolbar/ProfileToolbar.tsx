import { AccountCircle, SupervisedUserCircle } from '@mui/icons-material';
import { Badge, IconButton, MenuProps, Stack, Typography } from '@mui/material';
import { MouseEvent, useContext, useState } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { useIsMobile } from '~/common';
import { useSession } from '~/components/Session';
import { Notifications, useNotifications } from '../../Notifications';
import { ProfileMenu } from '../ProfileMenu';

export const ProfileToolbar = () =>
  useIsMobile() ? <MobileProfileToolbar /> : <DesktopProfileToolbar />;

const DesktopProfileToolbar = () => {
  const { session } = useSession();
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        <Notifications />
        <Typography color="primary" sx={{ fontWeight: 'medium' }}>
          {session?.fullName}
        </Typography>
        <ProfileButton onClick={(e) => setProfileAnchor(e.currentTarget)} />
      </Stack>
      <ProfileMenu
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
      />
    </>
  );
};

/**
 * Mobile: the notification bell and username collapse into the avatar — the
 * unread count rides as a badge on the avatar, and the username + notifications
 * move into the profile menu.
 */
const MobileProfileToolbar = () => {
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();
  const notifications = useNotifications();

  return (
    <>
      <ProfileButton
        onClick={(e) => setProfileAnchor(e.currentTarget)}
        unread={notifications.totalUnread}
      />
      <ProfileMenu
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
        notifications={notifications}
      />
    </>
  );
};

const ProfileButton = ({
  onClick,
  unread,
}: {
  onClick: (e: MouseEvent<HTMLElement>) => void;
  /** Mobile only: unread notification count shown as a badge over the avatar. */
  unread?: number;
}) => {
  const impersonation = useContext(ImpersonationContext);
  const icon = impersonation.enabled ? (
    <SupervisedUserCircle />
  ) : (
    <AccountCircle />
  );
  return (
    <IconButton
      color="secondary"
      aria-label={
        unread ? `Profile, ${unread} unread notifications` : 'Profile'
      }
      aria-controls="profile-menu"
      aria-haspopup="true"
      onClick={onClick}
    >
      {/*
        Default (rectangular) badge placement so this matches the header's
        filter badge exactly — both ride at the icon's top-right corner.
        `badgeContent={0}` renders nothing (showZero is off), so this is inert
        on desktop where `unread` is undefined.
      */}
      <Badge color="primary" badgeContent={unread ?? 0}>
        {icon}
      </Badge>
    </IconButton>
  );
};
