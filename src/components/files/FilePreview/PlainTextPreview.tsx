import { Grid, makeStyles } from '@material-ui/core';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

const useStyles = makeStyles(() => ({
  paragraph: {
    whiteSpace: 'pre-wrap',
    fontFamily: "'Roboto Mono', Consolas, Menlo, Monaco, Courier, monospace",
  },
}));

export const PlainTextPreview: FC<PreviewerProps> = ({ file }) => {
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);
  const classes = useStyles();
  const { previewLoading, setPreviewLoading } = useFileActions();
  const handleError = usePreviewError();

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
    if (file) {
      void renderHtml(file);
    }
  }, [file, renderHtml]);

  return previewLoading ? (
    <PreviewLoading />
  ) : (
    <Grid item>
      <div style={{ width: '80ch' }}>{html}</div>
    </Grid>
  );
};
