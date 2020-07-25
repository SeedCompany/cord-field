import { Box, Typography } from '@material-ui/core';
import React from 'react';

export const PreviewNotSupported = () => {
  return (
    <Box textAlign="center">
      <Typography variant="h3">
        Previewing is not supported for this file type
      </Typography>
    </Box>
  );
};
