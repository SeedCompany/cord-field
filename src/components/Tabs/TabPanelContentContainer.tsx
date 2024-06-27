import { Paper } from '@mui/material';
import { ReactNode } from 'react';
import { Sx } from '~/common';

interface TabPanelContentContainerProps {
  children: ReactNode;
  styles?: Sx;
}
export const TabPanelContentContainer = (
  props: TabPanelContentContainerProps
) => {
  const {
    children,
    styles = {
      flex: 1,
      padding: 0,
      maxWidth: '100cqw',
      width: 'min-content',
      maxHeight: 'calc(100cqh - 50px)',
    },
  } = props;
  return (
    <Paper
      sx={{
        ...styles,
      }}
    >
      {children}
    </Paper>
  );
};
