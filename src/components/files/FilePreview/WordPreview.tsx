import { Grid } from '@material-ui/core';
import parse from 'html-react-parser';
import mammoth from 'mammoth';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';

const mammothOptions = {
  styleMap: ['u => em'],
};

export const WordPreview: FC<PreviewerProps> = (props) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);

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
          setPreviewError('Could not read document file');
        }
      } catch {
        setPreviewError('Could not read document file');
      }
    },
    [setPreviewLoading, setPreviewError]
  );

  useEffect(() => {
    if (file) {
      void extractHtmlFromDocument(file);
    }
  }, [file, extractHtmlFromDocument]);

  return previewLoading ? <PreviewLoading /> : <Grid item>{html}</Grid>;
};
