import { useCallback, useState } from 'react';
import { Document, DocumentProps, Page, pdfjs } from 'react-pdf';
import { useFileActions } from '../FileActions/FileActionsContext';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { PreviewPagination } from './PreviewPagination';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type LoadedPdf = Parameters<NonNullable<DocumentProps['onLoadSuccess']>>[0];

export const PdfPreview = (props: PreviewerProps) => {
  const { file, setPreviewLoading, setPreviewError } = props;
  const [numberOfPages, setNumberOfPages] = useState(1);
  const { previewPage } = useFileActions();

  const handlePdfLoadSuccess = (pdf: LoadedPdf) => {
    const { numPages } = pdf;
    setNumberOfPages(numPages);
    setPreviewLoading(false);
  };

  const handlePdfError = useCallback(
    (error: Error) => {
      setPreviewError(error.message);
    },
    [setPreviewError]
  );

  return (
    <PreviewPagination pageCount={numberOfPages}>
      <Document
        file={file}
        loading={<PreviewLoading />}
        noData={<PreviewLoading />}
        onLoadError={handlePdfError}
        onLoadSuccess={handlePdfLoadSuccess}
        onSourceError={handlePdfError}
      >
        <Page pageNumber={previewPage} />
      </Document>
    </PreviewPagination>
  );
};

// eslint-disable-next-line import/no-default-export
export default PdfPreview;
