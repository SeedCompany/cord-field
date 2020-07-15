import { Box } from '@material-ui/core';
import React from 'react';
import { FilesOverviewCard as Card } from './FilesOverviewCard';

export default { title: 'components' };

export const FilesOverviewCard = () => {
  return (
    <Box display="flex" width={400}>
      <Card />
    </Box>
  );
};
