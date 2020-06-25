import { Box } from '@material-ui/core';
import React from 'react';
import { Dropzone } from '../../components/Upload';

export const Upload = () => {
  return (
    <Box m={4} width={1 / 3}>
      <Dropzone />
    </Box>
  );
};
