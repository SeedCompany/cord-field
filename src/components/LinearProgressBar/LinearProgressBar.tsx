import { Box, LinearProgress, Typography } from '@material-ui/core';
import * as React from 'react';
import { FC } from 'react';

interface LinearProgressBarProps {
  value?: number;
}

export const LinearProgressBar: FC<LinearProgressBarProps> = ({ value }) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {value && `${Math.round(value)}% Completed`}
        </Typography>
      </Box>
      <Box width="100%" mr={1} marginTop="8px">
        <LinearProgress color="primary" variant="determinate" value={value} />
      </Box>
    </Box>
  );
};
