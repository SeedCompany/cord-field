import { Components, Theme } from '@mui/material';
import { alpha as fade, lighten } from '@mui/material/styles';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';

export const appComponents = ({
  spacing,
  palette,
  typography,
  shape,
  transitions,
}: Theme): Components<Theme> => {
  const dark = palette.mode === 'dark';
  const primaryColorForText = dark
    ? palette.primary.light
    : palette.primary.main;
  return {
    MuiCssBaseline: {
      styleOverrides: {
        '#root': {
          minHeight: '100vh',
          display: 'flex',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
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
    },
    MuiFab: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'large', // MUI v4 default. Consider removing.
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 8,
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          // Add divider between card content & actions
          // Implementation is following <Divider /> from MUI v5
          // https://github.com/mui-org/material-ui/pull/18965
          borderTop: `thin solid ${palette.divider}`,
        },
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: typography.weight.medium,
          '&.Mui-focused': {
            color: primaryColorForText,
          },
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        // because we always shrink label we always want notch applied
        notched: true,
      },
      styleOverrides: {
        notchedOutline: {
          textTransform: 'uppercase',
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        variant: 'filled',
        fullWidth: true,
        margin: 'dense',
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          // Disallow user selection on labels as they are often clicked to change
          // boolean states. An accidental double click selects the label which
          // isn't what the user is trying to do.
          userSelect: 'none',
        },
      },
    },
    MuiFormLabel: {
      defaultProps: {
        required: false, // no asterisk
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            // subtler blue on dark mode
            WebkitBoxShadow: dark ? `0 0 0 100px #2e3d46 inset` : null,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
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
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
        color: dark ? 'primary.light' : 'primary.main',
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
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
    },
    MuiToggleButton: {
      styleOverrides: {
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
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          // Remove dangling divider
          '&:last-child td': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          transition: transitions.create('transform'),
          '&.Mui-selected': {
            transform: 'scale(1.43)', // 20px
          },
        },
      },
    },
    MuiTabs: {
      defaultProps: {
        indicatorColor: 'primary',
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'filled',
        fullWidth: true,
        margin: 'dense',
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          fontSize: typography.pxToRem(12),
          backgroundColor: fade(palette.grey[700], 0.94),
        },
      },
    },
  };
};
