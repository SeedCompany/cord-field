import { Box, Divider, DividerProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ComponentType } from 'react';
import { applyBreakpoint, BreakpointAt, extendSx, StyleProps } from '~/common';

export interface ResponsiveDividerProps extends DividerProps {
  vertical?: BreakpointAt;
  spacing?: number;
}

export const ResponsiveDivider = styled(
  Divider as ComponentType<ResponsiveDividerProps>
)(({ spacing, vertical, theme }) => ({
  root: {
    width: `calc(100% - ${theme.spacing(spacing ?? 0)} * 2)`,
    margin: theme.spacing(0, spacing ?? 0),
    '.MuiGrid-container > &': {
      marginRight: -1,
    },
    ...applyBreakpoint(theme.breakpoints, vertical, {
      margin: theme.spacing(spacing ?? 0, 0),
      borderLeftWidth: 'thin',
      // Divider orientation=vertical & flexItem
      width: 1,
      height: 'auto',
      alignSelf: 'stretch',
    }),
  },
}));

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
