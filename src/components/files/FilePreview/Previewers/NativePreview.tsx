import { Box } from '@mui/material';
import type { PreviewerProps } from '../FilePreview';

export const NativePreview = ({ file }: PreviewerProps) => {
  const props = {
    src: file.url,
    crossOrigin: 'use-credentials' as const,
    sx: { maxWidth: 800 },
  };

  const type = file.mimeType.split('/')[0];

  if (type === 'audio' || type === 'video') {
    return (
      <Box
        component={type}
        {...props}
        controls
        autoPlay
        controlsList="nodownload"
      />
    );
  }
  return <Box component="img" {...props} alt="" />;
};
