import { Box, CircularProgress, Grid } from '@mui/material';

export const PreviewLoading = () => {
  return (
    <Grid item>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 200,
          width: 200,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    </Grid>
  );
};
