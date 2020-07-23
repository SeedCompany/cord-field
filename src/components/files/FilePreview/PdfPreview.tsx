import React, { FC, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PreviewerProps } from './FilePreview';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PdfPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [pages, setPages] = useState<{
    numberOfPages: number;
    pageNumber: number;
  }>({ numberOfPages: 1, pageNumber: 1 });

  const handleLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPages((prevPages) => ({
      ...prevPages,
      numberOfPages: numPages,
    }));
  };

  return (
    <div>
      <Document file={downloadUrl} onLoadSuccess={handleLoadSuccess}>
        <Page pageNumber={pages.pageNumber} />
      </Document>
    </div>
  );
};
