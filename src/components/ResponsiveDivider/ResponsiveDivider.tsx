import { Box, Divider, DividerProps } from '@mui/material';
import { ComponentType } from 'react';
import { withStyles } from 'tss-react/mui';
import { applyBreakpoint, BreakpointAt, extendSx, StyleProps } from '~/common';

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

/**
 * Horizontal divider until `verticalWhen` css query is matched.
 */
export const ResponsiveDivider2 = ({
  verticalWhen,
  DividerProps,
  ...rest
}: { verticalWhen: string; DividerProps?: DividerProps } & StyleProps) => (
  <Box
    {...rest}
    sx={[
      {
        hr: { display: 'none' },
        'hr:nth-of-type(1)': { display: 'block' },
        [verticalWhen]: {
          display: 'flex',
          'hr:nth-of-type(2)': { display: 'initial' },
        },
      },
      ...extendSx(rest.sx),
    ]}
  >
    <Divider {...DividerProps} />
    <Divider {...DividerProps} orientation="vertical" flexItem />
  </Box>
);
