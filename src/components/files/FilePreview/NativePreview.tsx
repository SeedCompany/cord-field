import { Box, makeStyles } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { usePreview, usePreviewError } from './PreviewContext';
import { PreviewLoading } from './PreviewLoading';
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

  const player = (type: NativePreviewType) => {
    return type === NativePreviewType.Image ? (
      <img src={url} className={classes.media} alt="" />
    ) : (
      <video className={classes.media} controls autoPlay>
        <source src={url} />
        Your browser does not support HTML5 video.
      </video>
    );
  };

  return (
    <Box width="100%" height="100%" display="flex" justifyContent="center">
      {previewLoading ? <PreviewLoading /> : url ? player(type) : null}
    </Box>
  );
};
