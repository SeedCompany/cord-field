import { ThemeOptions } from './createTheme';

export const appProps: ThemeOptions['props'] = (_theme) => ({
  MuiCard: {
    elevation: 8,
  },
  MuiTextField: {
    variant: 'filled',
    fullWidth: true,
    margin: 'dense',
  },
  MuiFormLabel: {
    required: false, // no asterisk
  },
  MuiInputLabel: {
    shrink: true,
  },
  MuiOutlinedInput: {
    // because we always shrink label we always want notch applied
    notched: true,
  },
});

export const appOverrides: ThemeOptions['overrides'] = ({
  palette,
  typography,
}) => {
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
        fontWeight: typography.weight.regular,
        padding: '16px 40px',
      },
      outlined: {
        // This could be too aggressive
        background: palette.background.paper,
      },
    },
    MuiFab: {
      root: {
        textTransform: 'none',
      },
    },
    MuiInputLabel: {
      root: {
        textTransform: 'uppercase',
        fontWeight: typography.weight.medium,
        '&$focused': {
          color: primaryColorForText,
        },
      },
    },
    MuiFormControlLabel: {
      label: {
        // Disallow user selection on labels as they are often clicked to change
        // boolean states. An accidental double click selects the label which
        // isn't what the user is trying to do.
        userSelect: 'none',
      },
    },
    MuiFilledInput: {
      input: {
        '&:-webkit-autofill': {
          // subtler blue on dark mode
          WebkitBoxShadow: palette.dark ? `0 0 0 100px #2e3d46 inset` : null,
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
