import { Box } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { dateTime } from '../knobs.stories';
import { DefinedFileCard as Card } from './DefinedFileCard';

export default {
  title: 'Components/Defined File Card',
};

export const DefinedFileCard = () => {
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
    createdBy: createdByUser,
    type: 'File' as const,
    category: 'Document' as const,
    name: 'PNP',
    modifiedAt: new Date(),
    modifiedBy: modifiedByUser,
    downloadUrl: '',
  };
  const file = {
    mimeType: 'application/pdf',
    size: 6000,
    id: '12345',
    createdAt: DateTime.local(),
    createdBy: createdByUser,
    type: 'File' as const,
    category: 'Document' as const,
    name: text('name', 'PNP'),
    modifiedAt: dateTime('modifiedAt'),
    modifiedBy: modifiedByUser,
    children: {
      total: 1,
      hasMore: false,
      items: [childFile],
    },
    downloadUrl: '',
  };
  const securedFile = {
    canRead: boolean('canRead', true),
    canEdit: boolean('canEdit', true),
    value: file,
  };
  return (
    <Box display="flex" width={400}>
      <Card
        title="Growth Plan"
        onVersionUpload={action('onVersionUpload')}
        resourceType={text('resourceType', 'engagement')}
        securedFile={securedFile}
      />
    </Box>
  );
};

// export const Loading = () => (
//   <Box display="flex" width={400}>
//     <Card file={undefined} />
//   </Box>
// );
