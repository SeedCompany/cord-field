import {
  Divider,
  makeStyles,
  Menu,
  MenuProps,
  Typography,
  useTheme,
} from '@material-ui/core';
import * as React from 'react';
import { MenuItemLink } from '../../../../components/Routing';

const useStyles = makeStyles(({ spacing }) => ({
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
  const classes = useStyles();
  const { spacing } = useTheme();

  return (
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
    </Menu>
  );
};
