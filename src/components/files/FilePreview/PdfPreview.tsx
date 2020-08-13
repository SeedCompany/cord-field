import { PDFDocumentProxy } from 'pdfjs-dist';
import React, { FC, useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { usePreview } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { PreviewPagination } from './PreviewPagination';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PdfPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [numberOfPages, setNumberOfPages] = useState(1);
  const { setPreviewError, previewPage } = usePreview();

  const handlePdfLoadSuccess = useCallback(
    (pdf: PDFDocumentProxy) => {
      const { numPages } = pdf;
      setNumberOfPages(numPages);
    },
    [setNumberOfPages]
  );

  const handleError = useCallback(
    (error: Error) => {
      setPreviewError(error.message);
    },
    [setPreviewError]
  );

  return (
    <PreviewPagination pageCount={numberOfPages}>
      <Document
        file={downloadUrl}
        loading={<PreviewLoading />}
        onLoadError={handleError}
        onLoadSuccess={handlePdfLoadSuccess}
        onSourceError={handleError}
      >
        <Page pageNumber={previewPage} />
      </Document>
    </PreviewPagination>
  );
};
