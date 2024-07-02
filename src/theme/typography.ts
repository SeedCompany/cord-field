import type { TypographyOptions } from '@mui/material/styles/createTypography';
import { pickBy } from 'lodash';
import type { CSSProperties } from 'react';

export const typography = (): TypographyOptions => {
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

const variant = (size: number, lineHeightPx: number, weight?: FontWeight) =>
  pickBy({
    fontSize: size,
    fontWeight: weight,
    lineHeight: lineHeightPx / size,
  });

type FontWeight = CSSProperties['fontWeight'];

interface FontWeights {
  light: FontWeight;
  regular: FontWeight;
  medium: FontWeight;
  bold: FontWeight;
}

declare module '@mui/material/styles/createTypography' {
  interface FontStyle {
    weight: FontWeights;
  }
}
