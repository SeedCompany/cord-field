import { createMuiTheme } from '@material-ui/core';
// eslint-disable-next-line no-restricted-imports
import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
// eslint-disable-next-line no-restricted-imports
import createPalette from '@material-ui/core/styles/createPalette';
// eslint-disable-next-line no-restricted-imports
import createSpacing from '@material-ui/core/styles/createSpacing';
import { typography } from './typography';

const palette = createPalette({
  primary: {
    main: '#64b145',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9dcdd0',
  },
});

// Just so we don't have to keep digging for it
// sm: 600
// md: 960
// lg: 1280
// xl: 1920
const breakpoints = createBreakpoints({});

const spacing = createSpacing(8); // default

export const createTheme = () =>
  createMuiTheme({
    breakpoints,
    palette,
    spacing,
    typography,
  });

// Augment Material UI's theme (if/when needed)
declare module '@material-ui/core/styles/createMuiTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Theme {
    // extra things here
  }
}
