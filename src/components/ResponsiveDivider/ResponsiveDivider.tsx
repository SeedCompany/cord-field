import { Divider, DividerProps } from '@mui/material';
import { ComponentType } from 'react';
import { withStyles } from 'tss-react/mui';
import { applyBreakpoint, BreakpointAt } from '~/common';

export interface ResponsiveDividerProps extends DividerProps {
  vertical?: BreakpointAt;
  spacing?: number;
}

export const ResponsiveDivider = withStyles(
  Divider as ComponentType<ResponsiveDividerProps>,
  ({ spacing, breakpoints }, props) => ({
    root: {
      width: `calc(100% - ${spacing(props.spacing ?? 0)} * 2)`,
      margin: spacing(0, props.spacing ?? 0),
      '.MuiGrid-container > &': {
        marginRight: -1,
      },
      ...applyBreakpoint(breakpoints, props.vertical, {
        margin: spacing(props.spacing ?? 0, 0),
        borderLeftWidth: 'thin',
        // Divider orientation=vertical & flexItem
        width: 1,
        height: 'auto',
        alignSelf: 'stretch',
      }),
    },
  })
);
