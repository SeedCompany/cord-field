import { createMuiTheme } from '@material-ui/core';
// eslint-disable-next-line no-restricted-imports
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
// eslint-disable-next-line no-restricted-imports
import createPalette from '@material-ui/core/styles/createPalette';
// eslint-disable-next-line no-restricted-imports
import createSpacing from '@material-ui/core/styles/createSpacing';
// eslint-disable-next-line no-restricted-imports
import { Shape } from '@material-ui/core/styles/shape';
import { typography } from './typography';

const palette = createPalette({
  primary: {
    main: '#467f3b',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#ff5a5f',
  },
  error: {
    main: '#e87967',
  },
});

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

export const createTheme = () =>
  createMuiTheme({
    breakpoints,
    palette,
    spacing,
    shape,
    typography,
    props: {
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
      },
    },
    overrides: {
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
        },
        asterisk: {
          display: 'none',
        },
      },
    },
  });

// Augment Material UI's theme (if/when needed)
declare module '@material-ui/core/styles/createMuiTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme {
    // extra things here
  }
}
