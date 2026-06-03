import {
  createTheme as createMuiTheme,
  Theme as MuiTheme,
} from '@mui/material/styles';
import { appComponents } from './overrides';
import { createPalette } from './palette';
import { typography } from './typography';

export const createTheme = ({ dark }: { dark?: boolean } = {}) => {
  let theme = createMuiTheme({
    shape: {
      borderRadius: 6,
    },
    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536, mobile: 756 },
    },
    palette: createPalette({ dark }),
    typography,
  });
  theme = createMuiTheme({
    ...theme,
    components: appComponents(theme),
  });

  return theme;
};

// Communicate emotion's theme is MUI theme, which <ThemeProvider> does
declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends MuiTheme {}
}
