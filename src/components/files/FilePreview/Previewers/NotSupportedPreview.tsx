import { CloudDownload } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import { PreviewerProps } from '../FilePreview';

export const NotSupportedPreview = ({ file, onClose }: PreviewerProps) => (
  <Stack m={4} textAlign="center">
    <Typography variant="h3" paragraph lineHeight={1.5}>
      Previewing is not supported
      <br />
      for this file type
    </Typography>
    <Button
      href={file.url}
      color="primary"
      size="large"
      startIcon={<CloudDownload />}
      onClick={onClose}
    >
      Download
    </Button>
  </Stack>
);
