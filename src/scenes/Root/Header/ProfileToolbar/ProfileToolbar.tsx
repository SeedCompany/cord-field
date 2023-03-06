import {
  AccountCircle,
  MoreVert,
  NotificationsNone,
  SupervisedUserCircle,
} from '@mui/icons-material';
import {
  Box,
  Card,
  IconButton,
  MenuProps,
  Theme,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { extendSx, StyleProps } from '~/common';
import { useSession } from '../../../../components/Session';
import { ProfileMenu } from '../ProfileMenu';
import { UserActionsMenu } from '../UserActionsMenu';

const useStyles = makeStyles()(({ typography, spacing }) => ({
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

const mobileContrastText = (theme: Theme) => {
  return theme.palette.primary.contrastText;
};

const iconsSx = (theme: Theme) => ({
  '&.MuiIconButton-root': {
    [theme.breakpoints.up('xs')]: {
      color: mobileContrastText,
    },
    [theme.breakpoints.up('sm')]: {
      color: theme.palette.secondary.main,
    },
  },
});

const cardSx = (theme: Theme) => ({
  [theme.breakpoints.up('xs')]: {
    backgroundColor: theme.palette.background.sidebar,
    justifyContent: 'space-between',
    boxShadow: 0,
    mb: -1,
    ml: -2,
    borderRadius: 0,
  },
  [theme.breakpoints.up('sm')]: {
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[4],
    borderRadius: theme.shape.borderRadius / 6,
    m: 0,
  },
  [theme.breakpoints.up('mobile')]: {
    justifyContent: 'flex-end',
    mb: 0,
    ml: 1,
  },
});

export const ProfileToolbar = ({ sx }: StyleProps) => {
  const { classes } = useStyles();
  const { session } = useSession();
  const impersonation = useContext(ImpersonationContext);
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <Card className={classes.card} sx={[cardSx, ...extendSx(sx)]}>
        <Typography
          className={classes.name}
          color="primary"
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Hi, {session?.realFirstName.value ?? 'Friend'}
        </Typography>
        <IconButton
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          sx={iconsSx}
        >
          {impersonation.enabled ? <SupervisedUserCircle /> : <AccountCircle />}
        </IconButton>
        <Typography
          sx={(theme) => ({
            [theme.breakpoints.up('xs')]: {
              color: mobileContrastText,
              display: 'flex',
            },
            [theme.breakpoints.up('sm')]: {
              display: 'none',
            },
          })}
        >
          Account Settings
        </Typography>
        <Box
          sx={(theme) => ({
            [theme.breakpoints.up('xs')]: {
              display: 'none',
            },
            [theme.breakpoints.up('sm')]: {
              display: 'flex',
              justifyContent: 'space-between',
            },
          })}
        >
          <IconButton>
            <NotificationsNone />
          </IconButton>
          <IconButton onClick={(e) => setActionsAnchor(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        </Box>
      </Card>
      <ProfileMenu
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
      />
      <UserActionsMenu
        anchorEl={actionsAnchor}
        onClose={() => setActionsAnchor(null)}
      />
    </>
  );
};
