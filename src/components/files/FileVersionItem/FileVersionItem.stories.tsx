import { Box } from '@material-ui/core';
import { select, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { FileVersionItem as FVI } from './FileVersionItem';

export default { title: 'Components/files' };

export const FileVersionItem = () => {
  const version = {
    id: '12345',
    category: select(
      'Category',
      [
        'Audio',
        'Directory',
        'Document',
        'Image',
        'Other',
        'Spreadsheet',
        'Video',
      ],
      'Document'
    ),
    createdAt: DateTime.local(),
    createdBy: {
      displayFirstName: {
        value: text('First Name', 'Jane'),
      },
      displayLastName: {
        value: text('Last Name', 'Doe'),
      },
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
