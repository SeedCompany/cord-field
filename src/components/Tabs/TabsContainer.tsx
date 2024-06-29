import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TabsContainer = styled(Stack)(() => ({
  flex: 1,
  minHeight: 375,
  '& .MuiTabPanel-root': {
    flex: 1,
    padding: 0,
    '&:not([hidden])': {
      containerType: 'size',
      display: 'flex',
      flexDirection: 'column',
    },
  },
}));
