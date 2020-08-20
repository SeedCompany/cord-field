import { Grid } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

export const HtmlPreview: FC<PreviewerProps> = ({ file }) => {
  const [url, setUrl] = useState('');
  const { previewLoading, setPreviewLoading } = useFileActions();

  const createUrlForFile = useCallback(
    (file: File) => {
      setUrl(URL.createObjectURL(file));
      setPreviewLoading(false);
    },
    [setPreviewLoading, setUrl]
  );

  useEffect(() => {
    if (file) {
      void createUrlForFile(file);
    }
  }, [file, createUrlForFile]);

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
