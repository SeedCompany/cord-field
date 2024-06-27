import { Stack } from '@mui/material';
import { ReactNode } from 'react';

interface TabContainerProps {
  children: ReactNode;
}
export const TabContainer = (props: TabContainerProps) => {
  const { children } = props;
  return (
    <Stack
      sx={{
        flex: 1,
        minHeight: 375,
        container: 'main / size',
        '& .MuiTabPanel-root': {
          flex: 1,
          p: 0,
          '&:not([hidden])': {
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {children}
    </Stack>
  );
};
