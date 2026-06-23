import {
  createTheme as createMuiTheme,
  Theme as MuiTheme,
  responsiveFontSizes,
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
    components: appComponents(theme),
  });

  // Scale down large headings on smaller viewports so they don't dominate
  // the screen on mobile (h1 44px / h2 32px are sized for desktop).
  return responsiveFontSizes(theme);
};

// Communicate emotion's theme is MUI theme, which <ThemeProvider> does
declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme extends MuiTheme {}
}
