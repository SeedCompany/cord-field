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
        root: {
          // Don't wrap table in border if directly in a card, since the
          // elevated card is a good enough distinction.
          '.MuiPaper-root > &, .MuiPaper-root > .MuiTabPanel-root > &': {
            border: 'none',
          },
          // '--DataGrid-containerBackground': theme.palette.background.paper,

          // Our shared opt-in signaling that the DataGrid's has flex dimensions
          '&.flex-layout': {
            // MUI-X filler is flaky with flex layouts. It sometimes causes
            // pinned rows to not show, based on some JS calc race condition.
            // This block works around that, by avoiding their JS calc layout
            // values, and just using CSS.
            ...{
              // Change the filler to just spread to the entire area of the rows.
              // This avoids the JS calculation MUI-X does to try to position
              // the filler in the remaining space below the rows in order to fill
              // the intrinsic dimensions.
              '.MuiDataGrid-filler': {
                position: 'absolute',
                top: 0,
                height: '100% !important',
              },
              // Because the filler is below the rows in the DOM, we now have to
              // bump the z index of the rows, so they show above the filler.
              '.MuiDataGrid-virtualScrollerRenderZone': {
                zIndex: 1,
              },
              // Since the fillers top border is now hidden behind rows,
              // we need to recreate the bottom border of the last row.
              // Only if the filler is present, which MUI-X removes when not needed,
              // to avoid the border doubling up with the footer top border.
              '.MuiDataGrid-virtualScrollerContent:has(~.MuiDataGrid-filler) .MuiDataGrid-row--lastVisible .MuiDataGrid-cell':
                {
                  borderBottom: '1px solid var(--rowBorderColor)',
                },
            },
          },
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
