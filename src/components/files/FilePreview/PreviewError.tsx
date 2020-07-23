import { Box, Typography, useTheme } from '@material-ui/core';
import React, { FC } from 'react';

interface PreviewErrorProps {
  errorText: string;
}

export const PreviewError: FC<PreviewErrorProps> = (props) => {
  const { errorText } = props;
  const { spacing } = useTheme();
  return (
    <Box margin={spacing(2)}>
      <Typography variant="h2" color="error">
        {errorText}
      </Typography>
    </Box>
  );
};
