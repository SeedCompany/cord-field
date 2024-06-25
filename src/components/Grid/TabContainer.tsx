import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TabContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  maxWidth: `${theme.breakpoints.values.lg}px`,
}));
