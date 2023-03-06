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
    palette: createPalette({ dark }),
    typography,
  });
  theme = createMuiTheme({
    ...theme,
    breakpoints: {
      values: {
        ...theme.breakpoints.values,
        mobile: 756,
      },
    },
    components: appComponents(theme),
  });

  return theme;
};

// Communicate emotion's theme is MUI theme, which <ThemeProvider> does
declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends MuiTheme {}
}
