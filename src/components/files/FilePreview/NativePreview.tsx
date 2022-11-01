import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import type { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

export enum NativePreviewType {
  Video = 'video',
  Image = 'image',
  Audio = 'audio',
}

export interface NativePreviewerProps extends PreviewerProps {
  type: NativePreviewType;
}

export const NativePreview = (props: NativePreviewerProps) => {
  const { file, type, previewLoading, setPreviewLoading } = props;
  const [url, setUrl] = useState<string | undefined>();
  useEffect(() => {
    if (!file) {
      setUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file.slice());
    setUrl(url);
    setPreviewLoading(false);
    return () => URL.revokeObjectURL(url);
  }, [file, setUrl, setPreviewLoading]);

  const unsupportedTypeMessage =
    'Your browser does not support this media type';

  const player = (type: NativePreviewType) => {
    return type === NativePreviewType.Image ? (
      <Box
        component="img"
        src={url}
        sx={{
          maxWidth: 800,
        }}
        alt=""
      />
    ) : type === NativePreviewType.Audio ? (
      <audio controls autoPlay src={url}>
        {unsupportedTypeMessage}
      </audio>
    ) : (
      <Box
        component="video"
        sx={{
          maxWidth: 800,
        }}
        controls
        autoPlay
        controlsList="nodownload"
      >
        <source src={url} />
        {unsupportedTypeMessage}
      </Box>
    );
  };

  return previewLoading ? <PreviewLoading /> : url ? player(type) : null;
};
