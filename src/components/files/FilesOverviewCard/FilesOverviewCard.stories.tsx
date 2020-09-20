import { Box } from '@material-ui/core';
import { boolean, number } from '@storybook/addon-knobs';
import React from 'react';
import { FilesOverviewCard as Card } from './FilesOverviewCard';

export default { title: 'components' };

export const FilesOverviewCard = () => {
  return (
    <Box display="flex" width={400}>
      <Card
        loading={boolean('loading', false)}
        total={number('total', 1)}
        redacted={boolean('canReadFiles', true)}
      />
    </Box>
  );
};
