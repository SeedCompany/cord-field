import { Divider, Menu, MenuItem, MenuProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import { useDialog } from '../../../../components/Dialog';
import { MenuItemLink } from '../../../../components/Routing';
import { useSession } from '../../../../components/Session';
import { ChangePassword } from '../../../Authentication/ChangePassword';

const useStyles = makeStyles()(() => ({
  menu: {
    minWidth: 200,
  },
}));

// Menu looks for disabled prop to skip over when choosing
// which item to auto focus first.
const skipAutoFocus: any = { disabled: true };

export const ProfileMenu = (props: Partial<MenuProps>) => {
  const { classes } = useStyles();
  const { spacing } = useTheme();
  const { session } = useSession();
  const [changePasswordState, changePassword] = useDialog();
  const userId = session?.id;

  return (
    <>
      <Menu
        id="profile-menu"
        keepMounted
        open={Boolean(props.anchorEl)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{
          vertical: parseInt(spacing(-2)),
          horizontal: 'right',
        }}
        classes={{ paper: classes.menu }}
        {...props}
      >
        <Typography
          variant="h4"
          sx={{
            padding: spacing(1, 2, 2, 2),
          }}
          {...skipAutoFocus}
        >
          Profile Info
        </Typography>
        <Divider {...skipAutoFocus} />
        {userId && (
          <MenuItemLink to={`/users/${userId}`}>View Profile</MenuItemLink>
        )}
        <MenuItem
          onClick={(event) => {
            changePassword();
            props.onClose?.(event, 'backdropClick');
          }}
        >
          Change Password
        </MenuItem>
        <MenuItemLink to="/logout">Sign Out</MenuItemLink>
      </Menu>
      <ChangePassword {...changePasswordState} />
    </>
  );
};
