import { Pagination } from '@mui/material';
import { useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { Document, Page, pdfjs } from 'react-pdf';
import { PreviewerProps } from '../FilePreview';
import { PreviewLoading } from '../PreviewLoading';
import { useFilePreview } from '../useFilePreview';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const PdfPreview = ({ file }: PreviewerProps) => {
  const fileBody = useFilePreview(file);

  const [numberOfPages, setNumberOfPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { showBoundary: showError } = useErrorBoundary();

  return (
    <>
      <Pagination
        count={numberOfPages}
        onChange={(e, value) => setCurrentPage(value)}
        page={currentPage}
        showFirstButton
        showLastButton
        sx={{ mb: 2, ul: { justifyContent: 'center' } }}
      />
      <Document
        file={fileBody}
        loading={<PreviewLoading />}
        noData={<PreviewLoading />}
        onLoadSuccess={(doc) => setNumberOfPages(doc.numPages)}
        onLoadError={showError}
        onSourceError={showError}
      >
        <Page pageNumber={currentPage} />
      </Document>
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default PdfPreview;
