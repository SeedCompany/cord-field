import { ThemeOptions } from '@material-ui/core';
import { pickBy } from 'lodash';

export const typography: ThemeOptions['typography'] = (_palette) => ({
  fontFamily: 'sofia-pro, sans-serif',

  allVariants: {
    fontWeight: 500,
    color: '#484848',
  },

  // Header 1
  h1: variant(44, 55),
  // Header 2
  h2: variant(32, 36),
  // Header 3
  h3: variant(24, 28),
  // Header 4
  h4: variant(18, 24),
  // Body Copy
  body1: variant(16, 20, 400),
  // Small Copy
  body2: variant(14, 18),
  // X-Small / Legal Copy
  caption: variant(12, 14),
});

const variant = (size: number, lineHeightPx: number, weight?: number) =>
  pickBy({
    fontSize: size,
    fontWeight: weight,
    lineHeight: lineHeightPx / size,
  });
