import { Box } from '@mui/material';
import { ElementType, ReactElement } from 'react';
import { extendSx, StyleProps } from '~/common';

export type DashboardLayoutProps = {
  gap?: number;
  cols?: number;
  rows?: number;
  children: ReactElement[];
} & StyleProps;

export const widgets: ElementType[] = [];

export const DashboardLayout = ({
  gap = 1,
  cols = 12,
  rows = 12,
  children,
  sx,
}: DashboardLayoutProps) => {
  return (
    <Box
      sx={[
        {
          display: 'grid',
          gridGap: gap * 8,
          gridAutoRows: 'auto',
          gridAutoFlow: 'row',
          gridTemplateRows: `repeat(${
            rows * children.length
          }, minmax(${Math.floor((1 / rows) * 100)}%, 1fr));`,
          gridTemplateColumns: `repeat(${cols}, 1fr);`,
        },
        ...extendSx(sx),
      ]}
    >
      {children}
    </Box>
  );
};
