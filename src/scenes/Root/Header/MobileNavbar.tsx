import { Menu } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import {
  alignItemsCenter,
  extendSx,
  justifySpaceBetween,
  StyleProps,
  Sx,
} from '~/common';
import { getActiveItemLabel, RootNavList } from '../RootNavList';
import { HeaderSearch } from './HeaderSearch';
import { ProfileToolbar } from './ProfileToolbar';

const colorContrast = { color: 'primary.contrastText' } satisfies Sx;

export const MobileNavbar = ({ sx }: StyleProps) => {
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      css={alignItemsCenter}
      position="sticky"
      sx={[
        { bgcolor: 'background.sidebar', overflow: 'hidden' },
        ...extendSx(sx),
      ]}
    >
      <Toolbar sx={{ width: 1 }}>
        <Box css={[justifySpaceBetween, alignItemsCenter, { width: '100%' }]}>
          <Box css={alignItemsCenter}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setOpen(true)}
            >
              <Menu />
            </IconButton>
          </Box>
          {getActiveItemLabel()}
          <HeaderSearch />
        </Box>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          BackdropProps={{ invisible: true }}
          elevation={0}
          sx={{
            '& > .MuiDrawer-paper': {
              width: 240,
              mt: 7,
              // 56px is the height of the AppBar and is 7 * 8px
              height: 'calc(100vh - 56px)',
              backgroundColor: 'background.sidebar',
            },
          }}
        >
          <RootNavList
            subheader={
              <Box sx={{ mb: 1, mt: 2 }}>
                <Typography variant="h3" sx={{ ...colorContrast }}>
                  Cord Field
                </Typography>
                <Typography variant="subtitle2" sx={{ ...colorContrast }}>
                  Seed Company
                </Typography>
              </Box>
            }
          />
          <Box sx={{ position: 'absolute', bottom: 0 }}>
            <ProfileToolbar />
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};
