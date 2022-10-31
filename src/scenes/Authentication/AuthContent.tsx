import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { extendSx, StyleProps } from '~/common';

interface AuthContentProps extends StyleProps {
  className?: string;
  children?: ReactNode;
}

export const AuthContent = ({ className, children, sx }: AuthContentProps) => {
  return (
    <Box
      className={className}
      sx={[
        {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 400,
          my: 4,
          mx: 1,
        },
        ...extendSx(sx),
      ]}
    >
      {children}
    </Box>
  );
};
