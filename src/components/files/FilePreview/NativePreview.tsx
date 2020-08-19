import { Grid, makeStyles } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewableMimeType } from '../fileTypes';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { useRetrieveFile } from './useRetrieveFile';

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
  mimeType: PreviewableMimeType;
};

export const NativePreview: FC<NativePreviewProps> = ({
  downloadUrl,
  type,
  mimeType,
}) => {
  const classes = useStyles();
  const [url, setUrl] = useState('');
  const retrieveFile = useRetrieveFile();
  const { previewLoading, setPreviewLoading } = useFileActions();
  const handleError = usePreviewError();

  const createUrlForFile = useCallback(
    (file: File) => {
      setUrl(URL.createObjectURL(file));
      setPreviewLoading(false);
    },
    [setPreviewLoading, setUrl]
  );

  useEffect(() => {
    setPreviewLoading(true);
    void retrieveFile(downloadUrl, mimeType, createUrlForFile, () =>
      handleError('Could not download image')
    );
  }, [
    downloadUrl,
    mimeType,
    handleError,
    retrieveFile,
    setPreviewLoading,
    createUrlForFile,
  ]);

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
