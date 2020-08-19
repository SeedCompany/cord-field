import { Grid, makeStyles } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { MultiTypePreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { useRetrieveFile } from './useRetrieveFile';

const useStyles = makeStyles(() => ({
  paragraph: {
    whiteSpace: 'pre-wrap',
    fontFamily: "'Roboto Mono', Consolas, Menlo, Monaco, Courier, monospace",
  },
}));

export const PlainTextPreview: FC<MultiTypePreviewerProps> = ({
  downloadUrl,
  mimeType,
}) => {
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);
  const classes = useStyles();
  const { previewLoading, setPreviewLoading } = useFileActions();
  const handleError = usePreviewError();
  const retrieveFile = useRetrieveFile();

  const renderHtml = useCallback(
    async (file: File) => {
      try {
        const textContent = await file.text();
        const newLineCharacter =
          textContent.split('\r\n').length > 1
            ? '\r\n'
            : textContent.split('\n').length > 1
            ? '\n'
            : '\r';
        const lines = textContent.split(newLineCharacter);
        const html = lines.map((line, index) => (
          <p key={index} className={classes.paragraph}>
            {line}
          </p>
        ));
        setHtml(html);
        setPreviewLoading(false);
      } catch {
        handleError('Could not read document file');
      }
    },
    [classes, setPreviewLoading, handleError]
  );

  useEffect(() => {
    setPreviewLoading(true);
    void retrieveFile(downloadUrl, mimeType, renderHtml, () =>
      handleError('Could not download document')
    );
  }, [
    retrieveFile,
    setPreviewLoading,
    handleError,
    renderHtml,
    downloadUrl,
    mimeType,
  ]);

  return previewLoading ? (
    <PreviewLoading />
  ) : (
    <Grid item>
      <div style={{ width: '80ch' }}>{html}</div>
    </Grid>
  );
};
