import { grey } from '@mui/material/colors';
import { lighten, PaletteOptions } from '@mui/material/styles';

export const createPalette = ({ dark }: { dark?: boolean }) => {
  const mainGreen = '#467f3b';
  const palette: PaletteOptions = {
    mode: dark ? 'dark' : 'light',
    background: {
      default: dark ? '#303030' : grey[50], // MUI v4 default
    },
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
      primary: dark ? '#f3f4f6' : '#3c444e',
      secondary: '#8f928b',
    },
  };

  return palette;
};
