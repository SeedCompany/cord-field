import { alpha, createTheme as createMuiTheme } from '@mui/material/styles';
import { createTheme } from '../../../theme';

const listItemColor = '#fff';

const base = createTheme({ dark: true });
export const sidebarTheme = createMuiTheme({
  ...base,
  palette: {
    ...base.palette,
    background: {
      ...base.palette.background,
      paper: '#3c444e',
    },
    icons: {
      active: '#ffffff',
      inactive: '#BEC0C4',
      backgroundActive: '#29b67e',
      backgroundInactive: '#3c444e',
    },
  },
  components: {
    ...base.components,
    MuiListSubheader: {
      styleOverrides: {
        root: {
          color: '#d1dadf',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          // Same as default just changes the color from primary to white
          '&.Mui-selected': {
            '& .MuiListItemText-root': {
              display: 'flex',
              flex: 1,
              height: '100%',
            },
            '& .MuiListItemIcon-root': {
              backgroundColor: '#29B67E',
              color: '#ffffff',
            },
            '&:hover': {
              backgroundColor: alpha(
                listItemColor,
                base.palette.action.selectedOpacity +
                  base.palette.action.hoverOpacity
              ),
              '@media (hover: none)': {
                backgroundColor: alpha(
                  listItemColor,
                  base.palette.action.selectedOpacity
                ),
              },
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});
