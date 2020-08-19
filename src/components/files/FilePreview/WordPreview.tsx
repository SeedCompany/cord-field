import { Grid } from '@material-ui/core';
import parse from 'html-react-parser';
import mammoth from 'mammoth';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewableMimeType } from '../fileTypes';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { useRetrieveFile } from './useRetrieveFile';

const mammothOptions = {
  styleMap: ['u => em'],
};

export const WordPreview: FC<
  PreviewerProps & { mimeType: PreviewableMimeType }
> = ({ downloadUrl, mimeType }) => {
  const [html, setHtml] = useState<JSX.Element | JSX.Element[] | null>(null);
  const { previewLoading, setPreviewLoading } = useFileActions();
  const handleError = usePreviewError();
  const retrieveFile = useRetrieveFile();

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
    setPreviewLoading(true);
    void retrieveFile(downloadUrl, mimeType, extractHtmlFromDocument, () =>
      handleError('Could not download document')
    );
  }, [
    retrieveFile,
    setPreviewLoading,
    handleError,
    extractHtmlFromDocument,
    downloadUrl,
    mimeType,
  ]);

  return previewLoading ? <PreviewLoading /> : <Grid item>{html}</Grid>;
};
