import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

export const PlainTextPreview = (props: PreviewerProps) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);

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
          <Box
            component="p"
            key={index}
            sx={{
              whiteSpace: 'pre-wrap',
              fontFamily:
                "'Roboto Mono', Consolas, Menlo, Monaco, Courier, monospace",
            }}
          >
            {line}
          </Box>
        ));
        setHtml(html);
        setPreviewLoading(false);
      } catch {
        setPreviewError('Could not read document file');
      }
    },
    [setPreviewLoading, setPreviewError]
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
