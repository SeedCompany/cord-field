import parse from 'html-react-parser';
import mammoth from 'mammoth';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { usePreview } from './PreviewContext';
import { useRetrieveFile } from './useRetrieveFile';

const mammothOptions = {
  styleMap: ['u => em'],
};

export const WordPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [html, setHtml] = useState('');
  const { setPreviewError } = usePreview();
  const retrieveFile = useRetrieveFile(() =>
    setPreviewError('Could not download document')
  );

  const renderDocToHtml = useCallback(
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
        } else {
          setPreviewError('Could not read document file');
        }
      } catch (error) {
        console.log(error);
        setPreviewError('Could not read document file');
      }
    },
    [setPreviewError]
  );

  useEffect(() => {
    retrieveFile(downloadUrl).then((file) => {
      if (file) {
        renderDocToHtml(file);
      } else {
        setPreviewError('Could not download document');
      }
    });
  }, [retrieveFile, setPreviewError, renderDocToHtml, downloadUrl]);

  return <>{parse(html)}</>;
};
