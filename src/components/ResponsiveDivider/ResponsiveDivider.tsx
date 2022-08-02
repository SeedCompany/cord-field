import { Divider, DividerProps, withStyles } from '@material-ui/core';
import { applyBreakpoint, BreakpointAt } from '~/common';

export interface ResponsiveDividerProps extends DividerProps {
  vertical?: BreakpointAt;
  spacing?: number;
}

export const ResponsiveDivider = withStyles(
  ({ spacing, breakpoints }) => ({
    root: (props: ResponsiveDividerProps) => ({
      width: `calc(100% - ${spacing(props.spacing ?? 0)}px * 2)`,
      margin: spacing(0, props.spacing ?? 0),
      '.MuiGrid-container > &': {
        marginRight: -1,
      },
      ...applyBreakpoint(breakpoints, props.vertical, {
        margin: spacing(props.spacing ?? 0, 0),
        // Divider orientation=vertical & flexItem
        width: 1,
        height: 'auto',
        alignSelf: 'stretch',
      }),
    }),
  }),
  {
    name: 'ResponsiveDivider',
  }
)(Divider);
