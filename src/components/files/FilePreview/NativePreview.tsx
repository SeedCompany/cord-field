import { makeStyles } from '@mui/material';
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

const useStyles = makeStyles(() => ({
  media: {
    maxWidth: 800,
  },
}));

export const NativePreview = (props: NativePreviewerProps) => {
  const classes = useStyles();
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
      <img src={url} className={classes.media} alt="" />
    ) : type === NativePreviewType.Audio ? (
      <audio controls autoPlay src={url}>
        {unsupportedTypeMessage}
      </audio>
    ) : (
      <video
        className={classes.media}
        controls
        autoPlay
        controlsList="nodownload"
      >
        <source src={url} />
        {unsupportedTypeMessage}
      </video>
    );
  };

  return previewLoading ? <PreviewLoading /> : url ? player(type) : null;
};
