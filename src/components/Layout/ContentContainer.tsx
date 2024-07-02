import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ContentContainer = styled(Stack)(({ theme }) => ({
  flex: 1,
  overflow: 'hidden',
  padding: theme.spacing(4, 0, 0, 4),
}));
