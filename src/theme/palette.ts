import { PaletteColor, PaletteColorOptions } from '@mui/material';
import { grey } from '@mui/material/colors';
import { lighten, PaletteOptions } from '@mui/material/styles';
import { Role } from '~/api/schema/schema.graphql';

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
    create: {
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

    // TODO theme.palette.augmentColor()
    roles: {
      FieldPartner: { main: '#B2EBF2' },
      Translator: { main: '#FFE0B2' },
      ProjectManager: { main: '#E1BEE7' },
      Marketing: { main: '#DCEDC8' },
    },
  };

  return palette;
};

declare module '@mui/material/styles' {
  interface Palette {
    create: Palette['primary'];
    roles: Partial<Record<Role, Pick<PaletteColor, 'main'>>>;
  }
  interface PaletteOptions {
    create: PaletteOptions['primary'];
    roles: Partial<Record<Role, PaletteColorOptions>>;
  }
}
