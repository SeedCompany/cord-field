import { Box } from '@mui/material';
import { ChildrenProp, extendSx, StyleProps } from '~/common';

export type DashboardLayoutProps = ChildrenProp & {
  gap?: number;
  cols?: number;
  rows?: number;
} & StyleProps;

export const DashboardLayout = ({
  children,
  gap = 1,
  cols = 12,
  rows = 12,
  sx,
}: DashboardLayoutProps) => {
  const panels = Array.isArray(children) ? children.length : 1;
  return (
    <Box
      m={0}
      height={1}
      sx={[
        {
          display: 'grid',
          gridGap: gap * 8,
          gridAutoRows: 'auto',
          gridAutoFlow: 'row',
          gridTemplateRows: `repeat(${rows * panels}, minmax(8%, 1fr));`,
          gridTemplateColumns: `repeat(${cols}, 1fr);`,
        },
        ...extendSx(sx),
      ]}
    >
      {children}
    </Box>
  );
};
