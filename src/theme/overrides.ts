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
  MuiFormControl: {
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
  MuiTabs: {
    indicatorColor: 'primary',
  },
});

export const appOverrides: ThemeOptions['overrides'] = ({
  spacing,
  palette,
  typography,
  shape,
  transitions,
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
    MuiSelect: {
      // Fix focused shade from not having same border radius
      select: {
        '&.MuiSelect-filled:focus': {
          borderTopLeftRadius: shape.borderRadius,
          borderTopRightRadius: shape.borderRadius,
        },
        '&.MuiSelect-outlined:focus': {
          borderRadius: shape.borderRadius,
        },
      },
    },
    MuiTypography: {
      colorPrimary: {
        color: primaryColorForText,
      },
    },
    MuiToggleButtonGroup: {
      root: {
        backgroundColor: palette.background.paper,
      },
      grouped: {
        borderRadius: 'inherit', // conform to grouped radius
        // re-apply default MUI styles that are removed below
        '&.MuiToggleButton-root.Mui-selected': {
          '& + &': {
            borderLeft: 0,
            marginLeft: 0,
          },
        },
      },
    },
    MuiToggleButton: {
      root: {
        textTransform: 'none',
        color: palette.text.primary,
        '&:not(.MuiToggleButtonGroup-grouped)': {
          backgroundColor: palette.background.paper,
          borderRadius: 14, // if not grouped use this
          margin: spacing(1),
        },
        // $selected twice to increase specificity over selector above
        '&$selected$selected': {
          backgroundColor: '#2D9CDB',
          color: palette.getContrastText('#2D9CDB'),
          '&:hover': {
            backgroundColor: lighten('#2D9CDB', 0.15),
          },
          '&$disabled': {
            color: palette.getContrastText(fade('#2D9CDB', 0.4)),
            backgroundColor: fade('#2D9CDB', 0.4),
          },
        },
        // Remove spacing tweaks from MUI that assume the buttons are
        // right next to each other without spacing.
        // This selector has to match MUI's definition exactly
        // because the nulls are merged/applied in JS not CSS.
        // We revert this change above in ToggleButtonGroup, so that it only
        // applies to grouped buttons and not single ones.
        '&$selected': {
          '& + &': {
            borderLeft: null,
            marginLeft: null,
          },
        },
      },
    },
    MuiTableRow: {
      root: {
        // Remove dangling divider
        '&:last-child td': {
          borderBottom: 'none',
        },
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
      },
      wrapper: {
        transition: transitions.create('transform'),
      },
      selected: {
        '& $wrapper': {
          transform: 'scale(1.43)', // 20px
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: typography.pxToRem(12),
        backgroundColor: fade(palette.grey[700], 0.94),
      },
    },
  };
};
