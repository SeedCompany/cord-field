import { Grid } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { useRetrieveFile } from './useRetrieveFile';

export const HtmlPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [url, setUrl] = useState('');
  const { previewLoading, setPreviewLoading } = useFileActions();
  const handleError = usePreviewError();
  const retrieveFile = useRetrieveFile();

  const createUrlForFile = useCallback(
    (file: File) => {
      setUrl(URL.createObjectURL(file));
      setPreviewLoading(false);
    },
    [setPreviewLoading, setUrl]
  );

  useEffect(() => {
    setPreviewLoading(true);
    void retrieveFile(downloadUrl, 'text/html', createUrlForFile, () =>
      handleError('Could not download document')
    );
  }, [
    retrieveFile,
    setPreviewLoading,
    handleError,
    createUrlForFile,
    downloadUrl,
  ]);

  return previewLoading ? (
    <PreviewLoading />
  ) : (
    <Grid item>
      <iframe
        src={url}
        width={800}
        height={600}
        title="File Preview"
        referrerPolicy="no-referrer"
      />
    </Grid>
  );
};
