import { Box } from '@material-ui/core';
import { optionsKnob, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { FileAction } from '../FileActions';
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
    size: 1234,
    downloadUrl: '',
    type: 'FileVersion' as const,
  };
  const actions = optionsKnob(
    'Permitted Actions',
    FileAction,
    FileAction.Download,
    { display: 'radio' },
    'GROUP-ID1'
  );
  return (
    <Box width="40%">
      <FVI version={version} actions={Object.values(actions) as FileAction[]} />
    </Box>
  );
};
