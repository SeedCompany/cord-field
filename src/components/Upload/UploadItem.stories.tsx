import { Card } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { files, number, text } from '@storybook/addon-knobs';
import React from 'react';
import { UploadItem as UI } from './UploadItem';

export default { title: 'Components/Upload/UploadItem' };

export const UploadItem = () => {
  const file = {
    error: text('error', ''),
    file: (files('file', '.svg, .png, .xlsx, .pdf') as unknown) as File,
    fileName: text('fileName', 'File'),
    percentCompleted: number('percentCompleted', 50),
    queueId: 12345,
    uploadId: '12345',
    uploading: true,
  };
  const fileProp = {
    ...file,
    ...(file.error ? { error: new Error(file.error) } : { error: undefined }),
  };
  return (
    <Card style={{ maxWidth: 400 }}>
      <UI file={fileProp} onClear={action('click')} />
    </Card>
  );
};
