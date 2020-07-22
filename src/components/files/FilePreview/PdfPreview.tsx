import React, { FC, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfPreviewProps {
  downloadUrl: string;
}

export const PdfPreview: FC<PdfPreviewProps> = ({ downloadUrl }) => {
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
