import { lighten } from '@material-ui/core';
// eslint-disable-next-line @seedcompany/no-restricted-imports
import createMuiPalette, {
  // eslint-disable-next-line @seedcompany/no-restricted-imports
  PaletteOptions,
} from '@material-ui/core/styles/createPalette';

export const createPalette = (options: PaletteOptions) => {
  const light = options.type !== 'dark';
  const mainGreen = '#467f3b';
  const palette = createMuiPalette({
    primary: {
      main: mainGreen,
      contrastText: '#ffffff',
      // default is lighten main color by 0.2
      light: lighten(mainGreen, 0.4),
    },
    secondary: {
      main: '#3c444e',
    },
    error: {
      main: '#ff5a5f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f2994a',
    },
    text: {
      primary: light ? '#3c444e' : '#f3f4f6',
      secondary: '#8f928b',
    },
    ...options,
  });
  palette.dark = !light;

  return palette;
};
