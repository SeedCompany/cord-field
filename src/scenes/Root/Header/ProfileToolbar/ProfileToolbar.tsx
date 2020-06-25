import {
  Card,
  IconButton,
  makeStyles,
  MenuProps,
  Typography,
} from '@material-ui/core';
import {
  AccountCircle,
  CloudUpload,
  MoreVert,
  NotificationsNone,
} from '@material-ui/icons';
import { FC, useState } from 'react';
import * as React from 'react';
import { useSession } from '../../../../components/Session';
import { useUpload } from '../../../../components/Upload';
import { ProfileMenu } from '../ProfileMenu';

const useStyles = makeStyles(({ typography, spacing }) => ({
  card: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    padding: spacing(1),
  },
  name: {
    fontWeight: typography.weight.medium,
    margin: spacing(0, 1, 0, 2),
  },
}));

export const ProfileToolbar: FC = () => {
  const classes = useStyles();
  const [session] = useSession();
  const { isManagerOpen, setIsManagerOpen } = useUpload();
  const [anchor, setAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <Card className={classes.card}>
        <Typography className={classes.name} color="primary">
          Hi, {session?.realFirstName?.value ?? 'Friend'}
        </Typography>
        <IconButton
          color="secondary"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          <AccountCircle />
        </IconButton>
        <IconButton>
          <NotificationsNone />
        </IconButton>
        {!isManagerOpen && (
          <IconButton onClick={() => setIsManagerOpen(true)}>
            <CloudUpload />
          </IconButton>
        )}
        <IconButton>
          <MoreVert />
        </IconButton>
      </Card>
      <ProfileMenu anchorEl={anchor} onClose={() => setAnchor(null)} />
    </>
  );
};
