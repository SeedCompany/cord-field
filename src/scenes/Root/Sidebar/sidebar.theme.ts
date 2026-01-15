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
      paper: '#636466', // Dark Gray from Seed Company brand colors
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
            backgroundColor: alpha(
              listItemColor,
              base.palette.action.selectedOpacity
            ),
            '&.Mui-focusVisible': {
              backgroundColor: alpha(
                listItemColor,
                base.palette.action.selectedOpacity +
                  base.palette.action.focusOpacity
              ),
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
