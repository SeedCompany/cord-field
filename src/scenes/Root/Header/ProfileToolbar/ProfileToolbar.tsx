import { Card, IconButton, makeStyles, Typography } from '@material-ui/core';
import { AccountCircle, MoreVert, NotificationsNone } from '@material-ui/icons';
import { FC, useState } from 'react';
import * as React from 'react';
import { useSession } from '../../../../components/Session';
import { ProfileMenu } from '../ProfileMenu';

const useStyles = makeStyles(({ palette, typography }) => ({
  name: {
    fontWeight: typography.fontWeightMedium,
  },
  menuWrap: {
    position: 'relative',
  },
  infoWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    padding: '4px 16px',
    borderRadius: '6px',
  },
  icon: {
    marginLeft: '12px',
    cursor: 'pointer',
    '&:last-child': {
      marginLeft: '6px',
    },
  },
  iconProfile: {
    fill: palette.secondary.main,
  },
}));

export const ProfileToolbar: FC = () => {
  const classes = useStyles();
  const [session] = useSession();
  const [anchorEl, setAnchorEl] = useState(undefined);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.menuWrap}>
      <Card className={classes.infoWrap}>
        <Typography className={classes.name} color="primary">
          Hi, {session?.realFirstName.value}
        </Typography>
        <IconButton onClick={handleClick}>
          <AccountCircle className={classes.iconProfile} />
        </IconButton>
        <IconButton>
          <NotificationsNone />
        </IconButton>
        <IconButton>
          <MoreVert />
        </IconButton>
      </Card>
      {anchorEl && (
        <ProfileMenu anchorEl={anchorEl} handleClose={setAnchorEl} />
      )}
    </div>
  );
};
