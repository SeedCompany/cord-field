/* eslint-disable no-restricted-imports */
import { createMuiTheme, lighten } from '@material-ui/core';
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import createMuiPalette, {
  Palette,
  PaletteOptions,
} from '@material-ui/core/styles/createPalette';
import createSpacing from '@material-ui/core/styles/createSpacing';
import { Overrides } from '@material-ui/core/styles/overrides';
import { ComponentsProps } from '@material-ui/core/styles/props';
import { Shape } from '@material-ui/core/styles/shape';
import { typography } from './typography';

const createPalette = (options: PaletteOptions) => {
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

// Just so we don't have to keep digging for it
// sm: 600
// md: 960
// lg: 1280
// xl: 1920
const breakpoints = createBreakpoints({});

const spacing = createSpacing(8); // default

const shape: Shape = {
  borderRadius: 6,
};

const props: ComponentsProps = {
  MuiCard: {
    elevation: 8,
  },
  MuiTextField: {
    variant: 'filled',
    fullWidth: true,
    margin: 'dense',
  },
  MuiInputLabel: {
    shrink: true,
    required: false, // no asterisk
  },
};

const overrides = ({ palette }: { palette: Palette }): Overrides => {
  const primaryColorForText = palette.dark
    ? palette.primary.light
    : palette.primary.main;
  return {
    MuiButton: {
      root: {
        textTransform: 'none',
      },
      containedSizeLarge: {
        fontSize: '1rem',
        fontWeight: 400,
        padding: '16px 40px',
      },
    },
    MuiFormLabel: {
      root: {
        textTransform: 'uppercase',
        fontWeight: 500,
        '&$focused': {
          color: primaryColorForText,
        },
      },
    },
    MuiFilledInput: {
      input: {
        '&:-webkit-autofill': {
          // subtler blue on dark mode
          WebkitBoxShadow: palette.dark ? `0 0 0 100px #2e3d46 inset` : null,
          caretColor: palette.dark ? '#fff' : null, // fix cursor to match color
        },
      },
    },
    MuiTypography: {
      colorPrimary: {
        color: primaryColorForText,
      },
    },
  };
};

export const createTheme = ({ dark = false }: { dark?: boolean } = {}) => {
  const palette = createPalette({
    type: dark ? 'dark' : 'light',
  });
  return createMuiTheme(
    {
      breakpoints,
      palette,
      spacing,
      shape,
      typography,
      props,
      overrides: overrides({ palette }),
    },
    { dark }
  );
};

// Augment Material UI's theme (if/when needed)
declare module '@material-ui/core/styles/createMuiTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme {
    // extra things here
    dark: boolean;
  }
}

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    dark: boolean;
  }
}
