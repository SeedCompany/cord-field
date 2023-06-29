import { AccountCircle, SupervisedUserCircle } from '@mui/icons-material';
import {
  Card,
  IconButton,
  MenuProps,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useContext, useState } from 'react';
import { ImpersonationContext } from '~/api/client/ImpersonationContext';
import { alignItemsCenter, extendSx, StyleProps, Sx } from '~/common';
import { useSession } from '../../../../components/Session';
import { ProfileMenu } from '../ProfileMenu';

const iconsSx = {
  '&.MuiIconButton-root': {
    color: 'secondary.main',
  },
} satisfies Sx;

const cardSx = {
  flexShrink: 0,
  mb: { sm: 1 },
  boxShadow: 'none',
  backgroundColor: '#ffffff',
  mr: 2,
} satisfies Sx;

export const ProfileToolbar = ({ sx }: StyleProps) => {
  const { session } = useSession();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('sm')
  );
  const userFullName = `${session?.realFirstName.value ?? ''} ${
    session?.realLastName.value ?? ''
  }`;
  const firstInitial = session?.realFirstName.value?.slice(0, 1);
  const lastInitial = session?.realLastName.value?.slice(0, 1);

  const impersonation = useContext(ImpersonationContext);
  const [profileAnchor, setProfileAnchor] = useState<MenuProps['anchorEl']>();

  return (
    <>
      <Card css={alignItemsCenter} sx={[cardSx, ...extendSx(sx)]}>
        <Typography
          color="primary"
          fontWeight="medium"
          sx={(theme) => ({
            display: 'flex',
            m: theme.spacing(0, 0, 0, 2),
          })}
        >
          {!isMobile ? userFullName : `${firstInitial}${lastInitial}`}
        </Typography>
        <IconButton
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={(e) => setProfileAnchor(e.currentTarget)}
          sx={iconsSx}
        >
          {impersonation.enabled ? (
            <SupervisedUserCircle sx={{ color: '#091016' }} />
          ) : (
            <AccountCircle sx={{ color: '#091016' }} />
          )}
        </IconButton>
      </Card>
      <ProfileMenu
        anchorEl={profileAnchor}
        onClose={() => setProfileAnchor(null)}
      />
    </>
  );
};
