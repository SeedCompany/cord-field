import { Box } from '@material-ui/core';
import { text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { FileVersionItem as FVI } from './FileVersionItem';

export default { title: 'Components/files' };

export const FileVersionItem = () => {
  const version = {
    id: '12345',
    createdAt: DateTime.local(),
    createdBy: {
      id: '12345',
      fullName: text('Creator', 'Jane Doe'),
    },
    name: text('Name', 'Test File'),
    mimeType: text('mimeType', 'application/pdf'),
    downloadUrl: '',
    type: 'FileVersion' as const,
  };
  return (
    <Box width="40%">
      <FVI version={version} />
    </Box>
  );
};
