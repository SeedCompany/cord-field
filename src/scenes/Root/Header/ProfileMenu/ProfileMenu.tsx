import {
  Divider,
  makeStyles,
  Menu,
  MenuItem,
  MenuProps,
  Typography,
  useTheme,
} from '@material-ui/core';
import * as React from 'react';
import { useDialog } from '../../../../components/Dialog';
import { MenuItemLink } from '../../../../components/Routing';
import { ChangePassword } from '../../../Authentication/ChangePassword';

const useStyles = makeStyles(({ spacing }) => ({
  menu: {
    minWidth: 200,
  },
  menuHeading: {
    padding: spacing(1, 2, 2, 2),
  },
  uploadButtonText: {
    marginLeft: spacing(1),
  },
}));

// Menu looks for disabled prop to skip over when choosing
// which item to auto focus first.
const skipAutoFocus: any = { disabled: true };

export const ProfileMenu = (props: Partial<MenuProps>) => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const [changePasswordState, changePassword] = useDialog();

  return (
    <>
      <Menu
        id="profile-menu"
        keepMounted
        open={Boolean(props.anchorEl)}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: spacing(-2), horizontal: 'right' }}
        classes={{ paper: classes.menu }}
        {...props}
      >
        <Typography
          variant="h4"
          className={classes.menuHeading}
          {...skipAutoFocus}
        >
          Profile Info
        </Typography>
        <Divider {...skipAutoFocus} />
        <MenuItemLink to="/logout">Sign Out</MenuItemLink>
        <MenuItem
          onClick={(event) => {
            changePassword();
            props.onClose?.(event, 'backdropClick');
          }}
        >
          Change Password
        </MenuItem>
      </Menu>
      <ChangePassword {...changePasswordState} />
    </>
  );
};
