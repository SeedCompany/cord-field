import { Divider, DividerProps, withStyles } from '@material-ui/core';
import { applyBreakpoint, BreakpointAt } from '../../util';

export interface ResponsiveDividerProps extends DividerProps {
  vertical?: BreakpointAt;
  spacing?: number;
}

export const ResponsiveDivider = withStyles(
  ({ spacing, breakpoints }) => ({
    root: (props: ResponsiveDividerProps) => ({
      margin: spacing(0, props.spacing ?? 0),
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
