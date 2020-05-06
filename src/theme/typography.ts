import { pickBy } from 'lodash';
import { ThemeOptions } from './createTheme';

export const typography: ThemeOptions['typography'] = (palette) => {
  const weight: FontWeights = {
    light: 300, // default
    regular: 400, // default
    medium: 500, // default
    bold: 600,
  };
  return {
    fontFamily: 'sofia-pro, sans-serif',

    weight,
    fontWeightLight: weight.light,
    fontWeightRegular: weight.regular,
    fontWeightMedium: weight.medium,
    fontWeightBold: weight.bold,

    allVariants: {
      fontWeight: weight.medium,
      color: palette.text.primary,
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
    body1: variant(16, 20, weight.regular),
    // Small Copy
    body2: variant(14, 18),
    // X-Small / Legal Copy
    caption: variant(12, 14),
  };
};

const variant = (size: number, lineHeightPx: number, weight?: number) =>
  pickBy({
    fontSize: size,
    fontWeight: weight,
    lineHeight: lineHeightPx / size,
  });

interface FontWeights {
  light: number;
  regular: number;
  medium: number;
  bold: number;
}

declare module '@material-ui/core/styles/createTypography' {
  interface FontStyle {
    weight: FontWeights;
  }
}
