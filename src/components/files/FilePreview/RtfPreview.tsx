import rtfToHTML from '@iarna/rtf-to-html';
import { Grid } from '@material-ui/core';
import parse from 'html-react-parser';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { useRetrieveFile } from './useRetrieveFile';

export const RtfPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);
  const { previewLoading, setPreviewLoading } = useFileActions();
  const handleError = usePreviewError();
  const retrieveFile = useRetrieveFile();

  const extractHtmlFromDocument = useCallback(
    async (file: File) => {
      try {
        const rtfString = await file.text();
        rtfToHTML.fromString(
          rtfString,
          {
            template: (
              _: Record<string, any>,
              defaults: Record<string, any>,
              content: string
            ) => {
              return `
                <div style="
                  font-size: ${defaults.fontSize / 2}px;
                  text-indent: ${defaults.firstLineIndent / 20}px;
                  width: 80ch;
                ">
                  ${content.replace(/\n/, '\n    ')}
                </div>
              `;
            },
          },
          (error: Error | null, html: string) => {
            if (error) {
              console.log(error);
              handleError('Could not read document file');
            } else {
              setHtml(parse(html));
              setPreviewLoading(false);
            }
          }
        );
      } catch {
        handleError('Could not read document file');
      }
    },
    [setPreviewLoading, handleError]
  );

  useEffect(() => {
    setPreviewLoading(true);
    void retrieveFile(
      downloadUrl,
      'application/rtf',
      extractHtmlFromDocument,
      () => handleError('Could not download document')
    );
  }, [
    retrieveFile,
    setPreviewLoading,
    handleError,
    extractHtmlFromDocument,
    downloadUrl,
  ]);

  return previewLoading ? <PreviewLoading /> : <Grid item>{html}</Grid>;
};
