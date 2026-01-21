import { Divider, Menu, MenuProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { UIEvent, useContext } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { MenuItemLink } from '../../../../components/Routing';
import { useSession } from '../../../../components/Session';
import { ChangePasswordMenuItem } from './ChangePasswordMenuItem';
import { EarlyAccessMenuItem } from './EarlyAccessMenuItem';
import { ImpersonationMenuItem } from './ImpersonationDialog';
import { ToggleUploadManagerMenuItem } from './ToggleUploadManagerMenuItem';

// Menu looks for disabled prop to skip over when choosing
// which item to auto focus first.
const skipAutoFocus: any = { disabled: true };

export const ProfileMenu = (props: Partial<MenuProps>) => {
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
        paper: { sx: { minWidth: 200 } },
      }}
      {...props}
    >
      <Typography variant="h4" pt={1} p={2} {...skipAutoFocus}>
        Profile Info
      </Typography>
      <Divider {...skipAutoFocus} />
      {userId && (
        <MenuItemLink to={`/users/${userId}`}>View Profile</MenuItemLink>
      )}
      {!impersonation.enabled && (
        <ChangePasswordMenuItem onClick={handleCloseMenu} />
      )}
      <ToggleUploadManagerMenuItem onClick={handleCloseMenu} />
      <ImpersonationMenuItem onClick={handleCloseMenu} />
      <EarlyAccessMenuItem />
      <MenuItemLink to="/logout">Sign Out</MenuItemLink>
    </Menu>
  );
};
