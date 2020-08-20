import { Grid, makeStyles } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

const useStyles = makeStyles(() => ({
  media: {
    maxWidth: 800,
  },
}));

export enum NativePreviewType {
  Video = 'video',
  Image = 'image',
  Audio = 'audio',
}

type NativePreviewProps = PreviewerProps & {
  type: NativePreviewType;
};

export const NativePreview: FC<NativePreviewProps> = ({ file, type }) => {
  const classes = useStyles();
  const [url, setUrl] = useState('');
  const { previewLoading, setPreviewLoading } = useFileActions();

  const createUrlForFile = useCallback(
    (file: File) => {
      setUrl(URL.createObjectURL(file));
      setPreviewLoading(false);
    },
    [setPreviewLoading]
  );

  useEffect(() => {
    if (file) {
      void createUrlForFile(file);
    }
  }, [file, createUrlForFile]);

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

  return previewLoading ? (
    <PreviewLoading />
  ) : (
    <Grid item>{url ? player(type) : null}</Grid>
  );
};
