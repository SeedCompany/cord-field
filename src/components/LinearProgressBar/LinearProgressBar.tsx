import { Box, LinearProgress, Typography } from '@material-ui/core';
import * as React from 'react';
import { ProgressMeasurement } from '../../api';

interface LinearProgressBarProps {
  value: number;
  measurement: ProgressMeasurement;
  target: number;
}

export const LinearProgressBar = ({
  value,
  measurement,
  target,
}: LinearProgressBarProps) => {
  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">
          {measurement === 'Percent'
            ? `${Math.round(value)}%`
            : measurement === 'Number'
            ? `${value} / ${target}`
            : value === 1 // is boolean measurement
            ? 'Completed'
            : 'Not Completed'}
        </Typography>
      </Box>
      <Box width="100%" mr={1} marginTop="8px">
        <LinearProgress
          color="primary"
          variant="determinate"
          value={(value / target) * 100}
        />
      </Box>
    </Box>
  );
};
