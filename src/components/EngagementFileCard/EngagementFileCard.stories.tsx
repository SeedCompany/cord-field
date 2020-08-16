import { Box } from '@material-ui/core';
import { text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { dateTime } from '../knobs.stories';
import { EngagementFileCard as Card } from './EngagementFileCard';

export default {
  title: 'Components/Engagement File Card',
};

export const EngagementFileCard = () => {
  const createdByUser = {
    id: '9876',
    displayFirstName: {
      value: 'Jane',
    },
    displayLastName: {
      value: 'Smith',
    },
  };
  const modifiedByUser = {
    id: '5432',
    displayFirstName: {
      value: text('displayFirstName', 'Jane'),
    },
    displayLastName: {
      value: text('displayLastName', 'Smith'),
    },
  };
  const childFile = {
    mimeType: 'application/pdf',
    size: 6000,
    id: '12345',
    createdAt: DateTime.local(),
    type: 'File' as const,
    category: 'Document' as const,
    name: 'Language PnP',
    createdBy: createdByUser,
    modifiedAt: new Date(),
    modifiedBy: modifiedByUser,
    downloadUrl: '',
  };
  const file = {
    mimeType: 'application/pdf',
    size: 6000,
    id: '12345',
    createdAt: DateTime.local(),
    type: 'File' as const,
    category: 'Document' as const,
    name: text('name', 'Language PnP'),
    createdBy: createdByUser,
    modifiedAt: dateTime('modifiedAt'),
    modifiedBy: modifiedByUser,
    children: {
      total: 1,
      hasMore: false,
      items: [childFile],
    },
    downloadUrl: '',
  };
  return (
    <Box display="flex" width={400}>
      <Card file={file} />
    </Box>
  );
};

export const Loading = () => (
  <Box display="flex" width={400}>
    <Card file={undefined} />
  </Box>
);
