import { Grid } from '@material-ui/core';
import parse from 'html-react-parser';
import mammoth from 'mammoth';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

const mammothOptions = {
  styleMap: ['u => em'],
};

export const WordPreview: FC<PreviewerProps> = ({ file }) => {
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);
  const { previewLoading, setPreviewLoading } = useFileActions();
  const handleError = usePreviewError();

  const extractHtmlFromDocument = useCallback(
    async (file: File) => {
      try {
        const docBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml(
          { arrayBuffer: docBuffer },
          mammothOptions
        );
        if (result) {
          const imageStyledRawHtml = result.value.replace(
            /<img/gi,
            '<img style="max-width: 100%;"'
          );
          setHtml(parse(imageStyledRawHtml));
          setPreviewLoading(false);
        } else {
          handleError('Could not read document file');
        }
      } catch {
        handleError('Could not read document file');
      }
    },
    [setPreviewLoading, handleError]
  );

  useEffect(() => {
    if (file) {
      void extractHtmlFromDocument(file);
    }
  }, [file, extractHtmlFromDocument]);

  return previewLoading ? <PreviewLoading /> : <Grid item>{html}</Grid>;
};
