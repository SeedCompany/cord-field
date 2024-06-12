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
        root: ({ theme }) => ({
          // Don't wrap table in border if directly in a card, since the
          // elevated card is a good enough distinction.
          '.MuiPaper-root > &, .MuiPaper-root > .MuiTabPanel-root > &': {
            border: 'none',
          },
          // '--DataGrid-containerBackground': theme.palette.background.paper,
          '& .MuiDataGrid-columnHeaders > *': {
            paddingTop: theme.spacing(1),
          },
        }),
        columnHeaderTitle: {
          fontWeight: typography.weight.bold,
        },
        columnHeader: {
          // Don't show last column separator
          // TODO what if last column needs to be resizeable?
          '&.MuiDataGrid-columnHeader--last .MuiDataGrid-columnSeparator--sideRight':
            {
              display: 'none',
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
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  };
};
