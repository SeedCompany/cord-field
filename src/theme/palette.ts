import { PaletteColor, PaletteColorOptions } from '@mui/material';
import { PaletteOptions } from '@mui/material/styles';
import { Role } from '~/api/schema/schema.graphql';

/**
 * Seed Company Brand Colors
 * These colors are used throughout the application to maintain brand consistency
 * across both light and dark modes.
 */
const brandColors = {
  /** #F7F1E7 - Light beige used for light mode default background */
  natural: '#F7F1E7',
  /** #CDC3B0 - Medium beige used for secondary text in dark mode */
  stone: '#CDC3B0',
  /** #FFFFFF - Pure white used for paper backgrounds in light mode and contrast text */
  white: '#FFFFFF',
  /** #EBEBEC - Very light gray used for secondary color and primary text in dark mode */
  lightGray: '#EBEBEC',
  /** #636466 - Dark gray used for secondary color in light mode and paper background in dark mode */
  darkGray: '#636466',
  /** #323232 - Very dark gray (almost black) used for dark mode default background and primary text in light mode */
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
