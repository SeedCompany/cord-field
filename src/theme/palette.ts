import type { PaletteColor, PaletteColorOptions } from '@mui/material';
import { grey } from '@mui/material/colors';
import type { PaletteOptions } from '@mui/material/styles';
import type { Role } from '~/api/schema.graphql';

export const createPalette = ({ dark }: { dark?: boolean }) => {
  const mainGreen = '#1EA973';
  const roleLuminance = dark ? 50 : 84;
  const palette: PaletteOptions = {
    mode: dark ? 'dark' : 'light',
    background: {
      default: dark ? '#303030' : grey[50],
    },
    primary: {
      main: mainGreen,
      contrastText: '#ffffff',
    },
    secondary: {
      main: dark ? '#3c444e' : grey[50],
      contrastText: dark ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
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
      // Close to #3c444e while still using alpha
      ...(!dark ? { primary: 'rgba(0, 0, 0, 0.75)' } : {}),
    },

    roles: {
      FieldPartner: { main: `hsl(187deg, 71%, ${roleLuminance}%)` }, // #B2EBF2 / hsl(187deg, 71%, 82%)
      Translator: { main: `hsl(36deg, 100%, ${roleLuminance}%)` }, // #FFE0B2 / hsl(36deg, 100%, 85%)
      ProjectManager: { main: `hsl(291deg, 46%, ${roleLuminance}%)` }, // #E1BEE7 / hsl(291deg, 46%, 83%)
      Marketing: { main: `hsl(88deg, 51%, ${roleLuminance}%)` }, // #DCEDC8 / hsl(88deg, 51%, 86%)
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
