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
  useMediaQuery,
} from '@mui/material';
import { useContext, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
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
  return { color: theme.palette.primary.contrastText };
};

export const ProfileToolbar = () => {
  const { classes } = useStyles();
  const { session } = useSession();
  const impersonation = useContext(ImpersonationContext);
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();
  const isMobile = useMediaQuery('(max-width: 600px)');

  return !isMobile ? (
    <>
      <Card className={classes.card}>
        <Typography className={classes.name} color="primary">
          Hi, {session?.realFirstName.value ?? 'Friend'}
        </Typography>
        <IconButton
          color="secondary"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={(e) => setProfileAnchor(e.currentTarget)}
        >
          {impersonation.enabled ? <SupervisedUserCircle /> : <AccountCircle />}
        </IconButton>
        <IconButton>
          <NotificationsNone />
        </IconButton>
        <IconButton onClick={(e) => setActionsAnchor(e.currentTarget)}>
          <MoreVert />
        </IconButton>
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
  ) : (
    <Box sx={{ mb: -1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          color="secondary"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={(e) => setProfileAnchor(e.currentTarget)}
        >
          <AccountCircle sx={{ color: mobileContrastText, ml: -2 }} />
        </IconButton>
        <Typography sx={{ color: mobileContrastText }}>
          Account Settings
        </Typography>
        <ProfileMenu
          anchorEl={profileAnchor}
          onClose={() => setProfileAnchor(null)}
        />
        <UserActionsMenu
          anchorEl={actionsAnchor}
          onClose={() => setActionsAnchor(null)}
        />
      </Box>
    </Box>
  );
};
