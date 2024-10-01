import { Box } from '@mui/material';
import { many, Many } from '@seedcompany/common';
import { ReactElement } from 'react';
import { extendSx, StyleProps } from '~/common';

export type WidgetGridProps = {
  gap?: number;
  cols?: number;
  rows?: number;
  children: Many<ReactElement>;
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
          gridTemplateRows: `repeat(${
            rows * many(children).length
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
