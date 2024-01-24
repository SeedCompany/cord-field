import { Box, CircularProgress } from '@mui/material';

export const PreviewLoading = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200,
      minWidth: 200,
    }}
  >
    <CircularProgress size={60} />
  </Box>
);
