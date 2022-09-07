import { Card } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { number, text } from '@storybook/addon-knobs';
import { UploadItem as UI } from './UploadItem';

export default { title: 'Components/Upload/UploadItem' };

export const UploadItem = () => {
  const defaultFile = {
    error: text('error', ''),
    file: new File([''], 'filename', { type: 'text/html' }),
    fileName: text('fileName', 'File'),
    percentCompleted: number('percentCompleted', 50),
    queueId: 12345,
    uploadId: text('uploadId', ''),
    uploading: true,
  };
  const file = {
    ...defaultFile,
    ...(defaultFile.error
      ? { error: new Error(defaultFile.error) }
      : { error: undefined }),
  };
  return (
    <Card style={{ maxWidth: 400 }}>
      <UI file={file} onClear={action('click')} />
    </Card>
  );
};
