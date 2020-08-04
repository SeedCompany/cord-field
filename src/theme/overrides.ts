import { fade, lighten } from '@material-ui/core';
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
  MuiTooltip: {
    arrow: true,
  },
  MuiFab: {
    size: 'small',
  },
});

export const appOverrides: ThemeOptions['overrides'] = ({
  spacing,
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
    MuiCardActions: {
      root: {
        // Add divider between card content & actions
        // Implementation is following <Divider /> from MUI v5
        // https://github.com/mui-org/material-ui/pull/18965
        borderTop: `thin solid ${palette.divider}`,
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
    MuiOutlinedInput: {
      notchedOutline: {
        textTransform: 'uppercase',
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
    MuiToggleButton: {
      root: {
        borderRadius: 14,
        color: palette.text.primary,
        backgroundColor: palette.background.paper,
        margin: spacing(1),
        '&$selected': {
          backgroundColor: '#2D9CDB',
          color: palette.getContrastText('#2D9CDB'),
          '&:hover': {
            backgroundColor: lighten('#2D9CDB', 0.15),
          },
          '&$disabled': {
            color: palette.getContrastText(fade('#2D9CDB', 0.4)),
            backgroundColor: fade('#2D9CDB', 0.4),
          },
          // Remove spacing tweaks from MUI that assume the buttons are
          // right next to each other without spacing
          '& + &': {
            borderLeft: null,
            marginLeft: null,
          },
        },
      },
    },
  };
};
