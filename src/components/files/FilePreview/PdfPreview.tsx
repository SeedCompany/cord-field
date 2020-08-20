import { PDFDocumentProxy } from 'pdfjs-dist';
import React, { FC, useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { PreviewPagination } from './PreviewPagination';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PdfPreview: FC<PreviewerProps> = ({ file }) => {
  const [numberOfPages, setNumberOfPages] = useState(1);
  const { setPreviewLoading, previewPage } = useFileActions();
  const handleError = usePreviewError();

  const handlePdfLoadSuccess = (pdf: PDFDocumentProxy) => {
    const { numPages } = pdf;
    setNumberOfPages(numPages);
    setPreviewLoading(false);
  };

  const handlePdfError = useCallback(
    (error: Error) => {
      handleError(error.message);
    },
    [handleError]
  );

  return (
    <PreviewPagination pageCount={numberOfPages}>
      <Document
        file={file}
        loading={<PreviewLoading />}
        onLoadError={handlePdfError}
        onLoadSuccess={handlePdfLoadSuccess}
        onSourceError={handlePdfError}
      >
        <Page pageNumber={previewPage} />
      </Document>
    </PreviewPagination>
  );
};
