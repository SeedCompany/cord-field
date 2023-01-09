import { PaletteColor, PaletteColorOptions } from '@mui/material';
import { grey } from '@mui/material/colors';
import { lighten, PaletteOptions } from '@mui/material/styles';
import { Role } from '~/api/schema/schema.graphql';

export const createPalette = ({ dark }: { dark?: boolean }) => {
  const mainGreen = '#467f3b';
  const roleLuminance = dark ? 32 : 84;
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
      FieldPartner: { main: `hsl(187deg, 71%, ${roleLuminance}%)` }, // #B2EBF2 / hsl(187deg, 71%, 82%)
      Translator: { main: `hsl(36deg, 100%, ${roleLuminance}%)` }, // #FFE0B2 / hsl(36deg, 100%, 85%)
      ProjectManager: { main: `hsl(291deg, 46%, ${roleLuminance}%)` }, // #E1BEE7 / hsl(291deg, 46%, 83%)
      Marketing: { main: `hsl(88deg, 51%, ${roleLuminance}%)` }, // '#DCEDC8 / hsl(88deg, 51%, 86%)
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
