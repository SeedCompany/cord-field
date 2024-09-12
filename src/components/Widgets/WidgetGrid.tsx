import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { extendSx, StyleProps } from '~/common';

export type WidgetGridProps = {
  gap?: number;
  cols?: number;
  rows?: number;
  children: ReactElement[];
} & StyleProps;

export const WidgetGrid = ({
  gap = 1,
  cols = 12,
  rows = 12,
  children,
  sx,
}: WidgetGridProps) => {
  return (
    <Box
      sx={[
        {
          flex: 1,
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
