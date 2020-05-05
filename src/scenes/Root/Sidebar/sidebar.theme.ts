import { createTheme } from '../../../theme';

export const sidebarTheme = createTheme({
  dark: true,
  palette: {
    background: {
      paper: '#3c444e',
    },
  },
  overrides: () => ({
    MuiListSubheader: {
      root: {
        color: '#d1dadf',
      },
    },
    MuiListItem: {
      root: {
        borderRadius: 14,
      },
    },
    MuiMenuItem: {
      root: {
        borderRadius: 0,
      },
    },
  }),
});
