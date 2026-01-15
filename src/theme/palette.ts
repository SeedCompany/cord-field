import { PaletteColor, PaletteColorOptions } from '@mui/material';
import { grey } from '@mui/material/colors';
import { PaletteOptions } from '@mui/material/styles';
import { Role } from '~/api/schema/schema.graphql';

// Seed Company Brand Colors
const brandColors = {
  natural: '#F7F1E7',
  stone: '#CDC3B0',
  white: '#FFFFFF',
  lightGray: '#EBEBEC',
  darkGray: '#636466',
  black: '#323232',
};

export const createPalette = ({ dark }: { dark?: boolean }) => {
  const mainGreen = '#1EA973';
  const roleLuminance = dark ? 32 : 84;
  const palette: PaletteOptions = {
    mode: dark ? 'dark' : 'light',
    background: {
      default: dark ? brandColors.black : brandColors.natural,
      paper: dark ? brandColors.darkGray : brandColors.white,
    },
    primary: {
      main: mainGreen,
      contrastText: brandColors.white,
    },
    secondary: {
      main: dark ? brandColors.lightGray : brandColors.darkGray,
    },
    error: {
      main: '#ff5a5f',
      contrastText: brandColors.white,
    },
    create: {
      main: '#ff5a5f',
      contrastText: brandColors.white,
    },
    warning: {
      main: '#f2994a',
    },
    text: {
      primary: dark ? brandColors.lightGray : brandColors.black,
      secondary: dark ? brandColors.stone : brandColors.darkGray,
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
