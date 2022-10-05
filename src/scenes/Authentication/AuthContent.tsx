import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface AuthContentProps {
  className?: string;
  children?: ReactNode;
}

export const AuthContent = ({ className, children }: AuthContentProps) => {
  return (
    <Box
      className={className}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 400,
        margin: theme.spacing(4, 1),
      })}
    >
      {children}
    </Box>
  );
};
