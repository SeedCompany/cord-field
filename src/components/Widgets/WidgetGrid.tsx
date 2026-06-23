import { Box } from '@mui/material';
import { many, Many } from '@seedcompany/common';
import { ReactElement } from 'react';
import { extendSx, StyleProps, useIsMobile } from '~/common';

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
  const isMobile = useIsMobile();
  return (
    <Box
      sx={[
        isMobile
          ? {
              // Stack widgets full-width on mobile. Each needs a definite height
              // (the desktop grid's `gridRow` span is a no-op in a flex column)
              // so its grid fills the card and scrolls — sideways for columns,
              // down for rows.
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: `${gap * 8}px`,
              '& > *': { height: '70dvh' },
            }
          : {
              flex: 1,
              display: 'grid',
              gridGap: gap * 8,
              gridTemplateRows: `repeat(${
                rows * many(children).length
              }, minmax(${
                Math.floor((1 / rows) * 100) - 0.6 // 0.6 fixes height, punting on the permanent fix for now
              }%, 1fr));`,
              gridTemplateColumns: `repeat(${cols}, 1fr);`,
            },
        ...extendSx(sx),
      ]}
    >
      {children}
    </Box>
  );
};
