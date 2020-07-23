import React, { FC, useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PreviewerProps } from './FilePreview';
import { usePreview } from './PreviewContext';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PdfPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [pages, setPages] = useState<{
    numberOfPages: number;
    pageNumber: number;
  }>({ numberOfPages: 1, pageNumber: 1 });
  const { setError } = usePreview();

  const handleLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setPages((prevPages) => ({
        ...prevPages,
        numberOfPages: numPages,
      }));
    },
    []
  );

  const handleError = useCallback(
    (error: Error) => {
      setError(error.message);
    },
    [setError]
  );

  return (
    <div>
      <Document
        file={downloadUrl}
        onLoadError={handleError}
        onLoadSuccess={handleLoadSuccess}
        onSourceError={handleError}
      >
        <Page pageNumber={pages.pageNumber} />
      </Document>
    </div>
  );
};
