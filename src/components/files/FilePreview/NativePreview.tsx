import { Box, makeStyles } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { usePreview, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { PreviewNotSupported } from './PreviewNotSupported';
import { useRetrieveFile } from './useRetrieveFile';

const useStyles = makeStyles(() => ({
  media: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export enum NativePreviewType {
  Video = 'video',
  Image = 'image',
  Audio = 'audio',
}

type NativePreviewProps = PreviewerProps & { type: NativePreviewType };

export const NativePreview: FC<NativePreviewProps> = ({
  downloadUrl,
  type,
}) => {
  const classes = useStyles();
  const [url, setUrl] = useState('');
  const retrieveFile = useRetrieveFile();
  const { previewLoading, setPreviewLoading } = usePreview();
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
    retrieveFile(downloadUrl, createUrlForFile, () =>
      handleError('Could not download image')
    );
  }, [
    downloadUrl,
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
    ) : type === NativePreviewType.Video ? (
      <video className={classes.media} controls autoPlay>
        <source src={url} />
        {unsupportedTypeMessage}
      </video>
    ) : (
      <PreviewNotSupported />
    );
  };

  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center">
      {previewLoading ? <PreviewLoading /> : url ? player(type) : null}
    </Box>
  );
};
