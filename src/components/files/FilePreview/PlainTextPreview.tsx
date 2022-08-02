import { makeStyles } from '@material-ui/core';
import { useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

const useStyles = makeStyles(() => ({
  paragraph: {
    whiteSpace: 'pre-wrap',
    fontFamily: "'Roboto Mono', Consolas, Menlo, Monaco, Courier, monospace",
  },
}));

export const PlainTextPreview = (props: PreviewerProps) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);
  const classes = useStyles();

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
        setPreviewError('Could not read document file');
      }
    },
    [classes, setPreviewLoading, setPreviewError]
  );

  useEffect(() => {
    if (file) {
      void renderHtml(file);
    }
  }, [file, renderHtml]);

  return previewLoading ? (
    <PreviewLoading />
  ) : (
    <div style={{ width: '80ch' }}>{html}</div>
  );
};
