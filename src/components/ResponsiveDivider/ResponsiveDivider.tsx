import { Divider } from '@mui/material';
import { applyBreakpoint, BreakpointAt, extendSx, StyleProps } from '~/common';

/**
 * Horizontal divider until `vertical`
 */
export const ResponsiveDivider = ({
  vertical,
  spacing,
  ...rest
}: {
  /**
   * Can be:
   * - true
   * - a css media/container query
   * - a theme breakpoint up/down i.e. "mdUp"
   */
  vertical?: BreakpointAt;
  spacing?: number;
} & StyleProps) => (
  <Divider
    {...rest}
    sx={[
      (theme) => ({
        margin: theme.spacing(0, spacing ?? 0),
        ...applyBreakpoint(theme.breakpoints, vertical, {
          margin: theme.spacing(spacing ?? 0, 0),
          // Divider orientation=vertical
          borderBottomWidth: 0,
          borderRightWidth: 'thin',
          // Divider flexItem
          height: 'auto',
          alignSelf: 'stretch',
        }),
      }),
      ...extendSx(rest.sx),
    ]}
  />
);
