import type { Components, Theme } from '@mui/material';
import { alpha as fade } from '@mui/material/styles';

import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';

export const appComponents = ({
  spacing,
  palette,
  typography,
  shape,
}: Theme): Components<Theme> => {
  const dark = palette.mode === 'dark';
  return {
    MuiAppBar: {
      defaultProps: {
        elevation: 2,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '#root': {
          minHeight: '100vh',
          display: 'flex',
        },
        // Idk what this iframe is, but it's overlaying over everything and showing nothing.
        // Disable pointer events so DevTools will select through it.
        ...(process.env.NODE_ENV !== 'production' && {
          'body > iframe': {
            pointerEvents: 'none',
          },
        }),
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
    },
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 2,
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          // Add divider between card content & actions
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
          '&.Mui-focused': {
            color: palette.primary.main,
          },
        },
        shrink: {
          fontWeight: typography.weight.medium,
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        // because we always shrink label we always want notch applied
        notched: true,
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
        underline: 'always',
        color: 'primary.main',
      },
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        color: 'info',
      },
    },
    MuiToggleButton: {
      defaultProps: {
        color: 'info',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 14,
          '&:not(.MuiToggleButtonGroup-grouped)': {
            margin: spacing(1),
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          // Don't wrap table in border if directly in a card, since the
          // elevated card is a good enough distinction.
          '.MuiPaper-root > &, .MuiPaper-root > .MuiTabPanel-root > &': {
            border: 'none',
          },
          // Prevent browser from selecting text in the cell to the right
          // when double-clicking cells that only have an icon or button (no text)
          '.MuiDataGrid-cell:has(svg:only-child, .MuiButtonBase-root:only-child)':
            { userSelect: 'all' },

          // Cell error styling
          '& .cell-invalid': {
            paddingRight: '10px',
            backgroundColor: fade(palette.error.light, 0.4),
            '&:hover': {
              backgroundColor: fade(palette.error.light, 0.8),
            },
          },

          // '--DataGrid-containerBackground': theme.palette.background.paper,
        },
        columnHeaderTitle: {
          fontWeight: typography.weight.bold,
        },
        columnHeader: {
          '&:focus-within': {
            outline: 'none',
          },
        },
        filterForm: {
          // Undo MuiFormControl.defaultProps.fullWidth: true
          '.MuiFormControl-root': {
            '&.MuiDataGrid-filterFormDeleteIcon, &.MuiDataGrid-filterFormLogicOperatorInput':
              {
                width: 'initial',
              },
          },
        },
        filterFormValueInput: {
          // Undo MuiTextField.defaultProps.margin: 'dense'
          '.MuiFormControl-root': {
            margin: 0,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontSize: '1.25rem',
          'span:not(.MuiTouchRipple-root)': {
            transition: theme.transitions.create('transform'),
            transform: 'scale(.75)',
          },
          '&.Mui-selected span:not(.MuiTouchRipple-root)': {
            transform: 'scale(1)',
          },
        }),
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
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  };
};
