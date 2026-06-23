import { Box, Divider, Menu, Typography } from '@mui/material';
import type { MenuProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { UIEvent } from 'react';
import { useContext } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { MenuItemLink } from '~/components/Routing';
import { useSession } from '~/components/Session';
import { NotificationList } from '../../Notifications';
import type { UseNotifications } from '../../Notifications';
import { ChangePasswordMenuItem } from './ChangePasswordMenuItem';
import { ImpersonationMenuItem } from './ImpersonationDialog';
import { ToggleUploadManagerMenuItem } from './ToggleUploadManagerMenuItem';

export interface ProfileMenuProps extends Partial<MenuProps> {
  /** When provided (mobile), the menu shows the username header + notifications. */
  notifications?: UseNotifications;
}

export const ProfileMenu = ({ notifications, ...props }: ProfileMenuProps) => {
  const { spacing } = useTheme();
  const { session } = useSession();
  const impersonation = useContext(ImpersonationContext);

  const userId = session?.id;

  const handleCloseMenu = (event: UIEvent) =>
    props.onClose?.(event, 'backdropClick');

  return (
    <Menu
      id="profile-menu"
      keepMounted
      open={Boolean(props.anchorEl)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{
        vertical: parseInt(spacing(-2)),
        horizontal: 'right',
      }}
      slotProps={{
        paper: { sx: { minWidth: notifications ? 'min(360px, 90vw)' : 200 } },
      }}
      // The header rows below (title/divider/notifications) aren't menu items;
      // don't auto-focus into the list so focus opens on the menu itself.
      MenuListProps={{ autoFocusItem: false }}
      {...props}
    >
      <Typography variant="h4" pt={1} p={2}>
        {notifications && session?.fullName ? session.fullName : 'Profile Info'}
      </Typography>
      <Divider />
      {notifications?.enabled && (
        <Box>
          <Typography
            variant="overline"
            color="text.secondary"
            sx={{ display: 'block', px: 2, pt: 1 }}
          >
            Notifications
          </Typography>
          <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
            <NotificationList notifications={notifications} />
          </Box>
          <Divider />
        </Box>
      )}
      {userId && (
        <MenuItemLink to={`/users/${userId}`}>View Profile</MenuItemLink>
      )}
      {!impersonation.enabled && (
        <ChangePasswordMenuItem onClick={handleCloseMenu} />
      )}
      <ToggleUploadManagerMenuItem onClick={handleCloseMenu} />
      <ImpersonationMenuItem onClick={handleCloseMenu} />
      <MenuItemLink to="/logout">Sign Out</MenuItemLink>
    </Menu>
  );
};
