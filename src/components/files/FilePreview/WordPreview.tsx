import parse from 'html-react-parser';
import mammoth from 'mammoth';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { usePreview, usePreviewError } from './PreviewContext';
import { PreviewLoading } from './PreviewLoading';
import { useRetrieveFile } from './useRetrieveFile';

const mammothOptions = {
  styleMap: ['u => em'],
};

export const WordPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [html, setHtml] = useState('');
  const { previewLoading, setPreviewLoading } = usePreview();
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
          setHtml(imageStyledRawHtml);
          setPreviewLoading(false);
        } else {
          handleError('Could not read document file');
        }
      } catch (error) {
        console.log(error);
        handleError('Could not read document file');
      }
    },
    [setPreviewLoading, handleError]
  );

  useEffect(() => {
    setPreviewLoading(true);
    retrieveFile(downloadUrl, extractHtmlFromDocument, () =>
      handleError('Could not download document')
    );
  }, [
    retrieveFile,
    setPreviewLoading,
    handleError,
    extractHtmlFromDocument,
    downloadUrl,
  ]);

  return previewLoading ? <PreviewLoading /> : <>{parse(html)}</>;
};
