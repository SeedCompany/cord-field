import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Drawer, IconButton } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { useToggle } from 'ahooks';
import { CSSObject } from 'tss-react';
import { RootNavList } from '../RootNavList';
import { SidebarHeader } from './SidebarHeader';

const drawerWidth = 248;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  borderRight: '1px solid #e0e0e0',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  borderRight: '1px solid #fafafa',
  overflowX: 'hidden',
  width: 60,
});

export const SidebarDrawer = () => {
  const [open, setOpen] = useToggle(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        open={open}
        elevation={0}
        sx={(theme) => ({
          width: drawerWidth,
          flexShrink: 0,
          border: 'none',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
          }),
          ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
          }),
        })}
      >
        <SidebarHeader />
        <RootNavList />
        <Box
          onClick={() => {
            setOpen.toggle();
          }}
          sx={{
            height: 1,
            display: 'flex',
            flex: 1,
            flexShrink: 0,
            cursor: 'pointer',
            backgroundColor: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: 60,
              height: 1,
              backgroundColor: 'background.paper',
            }}
          />
        </Box>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'end',
            cursor: 'pointer',
            width: 1,
            backgroundColor: 'white',
          }}
        >
          <div
            css={{
              width: 60,
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 32,
              backgroundColor: '#3c444e',
            }}
          />
          <IconButton
            onClick={() => {
              setOpen.toggle();
            }}
            disableRipple
            disableFocusRipple
            sx={{
              width: 60,
              p: 0,
            }}
            size="large"
          >
            {open ? (
              <ChevronLeft
                sx={{
                  height: 32,
                  width: 32,
                  color: '#091016',
                }}
              />
            ) : (
              <ChevronRight
                sx={{
                  height: 32,
                  width: 32,
                  color: 'white',
                }}
              />
            )}
          </IconButton>
        </Box>
      </Drawer>
    </Box>
  );
};
