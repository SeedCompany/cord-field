import {
  AccountCircle,
  MoreVert,
  NotificationsNone,
  SupervisedUserCircle,
} from '@mui/icons-material';
import { Box, Card, IconButton, MenuProps, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { alignItemsCenter, extendSx, StyleProps, Sx } from '~/common';
import { useSession } from '../../../../components/Session';
import { ProfileMenu } from '../ProfileMenu';
import { UserActionsMenu } from '../UserActionsMenu';

const iconsSx = {
  '&.MuiIconButton-root': {
    color: {
      xs: 'primary.contrastText',
      sm: 'secondary.main',
    },
  },
} satisfies Sx;

const cardSx = {
  flexShrink: 0,
  m: { sm: 0 },
  p: { sm: 1 },
  boxShadow: { xs: 0, sm: 4 },
  borderRadius: { xs: 0, sm: 1 },
  backgroundColor: { xs: 'background.sidebar', sm: 'background.default' },
  justifyContent: { xs: 'space-between', mobile: 'flex-end' },
  ml: { xs: 0, mobile: 1 },
} satisfies Sx;

export const ProfileToolbar = ({ sx }: StyleProps) => {
  const { session } = useSession();
  const impersonation = useContext(ImpersonationContext);
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();
  const [actionsAnchor, setActionsAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <Card css={alignItemsCenter} sx={[cardSx, ...extendSx(sx)]}>
        <Typography
          color="primary"
          fontWeight="medium"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            m: (theme) => theme.spacing(0, 1, 0, 2),
          }}
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
          sx={{
            display: { xs: 'flex', sm: 'none' },
            color: { xs: 'primary.contrastText' },
          }}
        >
          Account Settings
        </Typography>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            justifyContent: { xs: 'space-between' },
          }}
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
