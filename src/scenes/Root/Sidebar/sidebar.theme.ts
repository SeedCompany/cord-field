import { createTheme as createMuiTheme } from '@mui/material/styles';
import { createTheme } from '../../../theme';

const base = createTheme();
export const sidebarTheme = createMuiTheme({
  ...base,
  palette: {
    ...base.palette,
    background: {
      ...base.palette.background,
      paper: '#3c444e',
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
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 14,
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
