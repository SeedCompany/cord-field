import { Box, makeStyles } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { usePreview, usePreviewError } from './PreviewContext';
import { PreviewLoading } from './PreviewLoading';
import { useRetrieveFile } from './useRetrieveFile';

const useStyles = makeStyles(() => ({
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

export const ImagePreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const classes = useStyles();
  const [url, setUrl] = useState('');
  const retrieveFile = useRetrieveFile();
  const { previewLoading, setPreviewLoading } = usePreview();
  const handleError = usePreviewError();

  const createImageUrl = useCallback(
    (file: File) => {
      setUrl(URL.createObjectURL(file));
      setPreviewLoading(false);
    },
    [setPreviewLoading, setUrl]
  );

  useEffect(() => {
    setPreviewLoading(true);
    retrieveFile(downloadUrl, createImageUrl, () =>
      handleError('Could not download image')
    );
  }, [
    downloadUrl,
    handleError,
    retrieveFile,
    setPreviewLoading,
    createImageUrl,
  ]);

  return (
    <Box>
      {previewLoading ? (
        <PreviewLoading />
      ) : url ? (
        <img src={url} className={classes.image} alt="" />
      ) : null}
    </Box>
  );
};
