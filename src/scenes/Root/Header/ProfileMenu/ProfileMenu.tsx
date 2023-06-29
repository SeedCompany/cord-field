import { Divider, Menu, MenuItem, MenuProps, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useContext } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { useDialog } from '../../../../components/Dialog';
import { MenuItemLink } from '../../../../components/Routing';
import { useSession } from '../../../../components/Session';
import { ChangePassword } from '../../../Authentication/ChangePassword';
import { ImpersonationMenuItem } from './ImpersonationDialog';

const useStyles = makeStyles()(({ spacing }) => ({
  menu: {
    minWidth: 200,
  },
  menuHeading: {
    padding: spacing(1, 2, 2, 2),
  },
}));

// Menu looks for disabled prop to skip over when choosing
// which item to auto focus first.
const skipAutoFocus: any = { disabled: true };

export const ProfileMenu = (props: Partial<MenuProps>) => {
  const { classes } = useStyles();
  const { spacing } = useTheme();
  const { session } = useSession();
  const impersonation = useContext(ImpersonationContext);

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
        sx={{
          // something is overiding the background and text color on mobile
          // sizes so I added this to override it.
          '& .MuiList-root': {
            bgcolor: '#ffffff',
          },
          '& .MuiTypography-root': { color: 'background.sidebar' },
          '& .MuiMenuItem-root': { color: 'background.sidebar' },
        }}
        {...props}
      >
        <Typography
          variant="h4"
          className={classes.menuHeading}
          {...skipAutoFocus}
        >
          Profile Info
        </Typography>
        {/*divider is not showing up on xs screen sizes, can't figure out why*/}
        <Divider {...skipAutoFocus} />
        {userId && (
          <MenuItemLink to={`/users/${userId}`}>View Profile</MenuItemLink>
        )}
        {!impersonation.enabled && (
          <MenuItem
            onClick={(event) => {
              changePassword();
              props.onClose?.(event, 'backdropClick');
            }}
          >
            Change Password
          </MenuItem>
        )}
        <ImpersonationMenuItem
          onClick={(event) => {
            props.onClose?.(event, 'backdropClick');
          }}
        />
        <MenuItemLink to="/logout">Sign Out</MenuItemLink>
      </Menu>
      <ChangePassword {...changePasswordState} />
    </>
  );
};
