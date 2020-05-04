import { makeStyles, Menu, MenuItem } from '@material-ui/core';
import { FC } from 'react';
import * as React from 'react';
import { Link } from '../../../../components/Routing';

const useStyles = makeStyles(({ typography }) => ({
  menu: {
    width: '230px',
    position: 'absolute',
    top: '100px !important',
    right: '100px !important',
    left: 'auto !important',
  },
  menuHeading: {
    fontWeight: typography.fontWeightMedium,
    padding: '8px 0',
    fontSize: 16,
  },
  signOut: {
    padding: '14px 0 6px 0',
    borderTop: '1px solid #E5E5E5',
    display: 'block',
  },
  paper: {
    position: 'static',
    padding: '16px',
  },
}));

export interface ProfileMenuProps {
  anchorEl: Element | null | undefined;
  handleClose: (type: any) => void;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({
  anchorEl,
  handleClose,
}) => {
  const classes = useStyles();

  return (
    <Menu
      className={classes.menu}
      classes={{
        paper: classes.paper,
      }}
      id="profile-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => handleClose(null)}
    >
      <MenuItem className={classes.menuHeading} color="secondary">
        Profile Info
      </MenuItem>
      <Link className={classes.signOut} to="/logout">
        Sign Out
      </Link>
    </Menu>
  );
};
