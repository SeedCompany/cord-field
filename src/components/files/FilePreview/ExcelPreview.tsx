import parse from 'html-react-parser';
import React, { FC, useCallback, useEffect, useState } from 'react';
import XLSX from 'xlsx';
import { SupportedType } from '../FILE_MIME_TYPES';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { SpreadsheetView } from './SpreadsheetView';
import { useRetrieveFile } from './useRetrieveFile';

interface Sheet {
  name: string;
  html: JSX.Element | JSX.Element[];
}

export const ExcelPreview: FC<PreviewerProps & { mimeType: SupportedType }> = ({
  downloadUrl,
  mimeType,
}) => {
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const { previewLoading, setPreviewLoading } = useFileActions();
  const retrieveFile = useRetrieveFile();
  const handleError = usePreviewError();

  const extractExcelDataFromWorkbook = useCallback(
    async (file: File) => {
      const { data, error } = await convertToHtml(file);
      if (error) {
        handleError(error.message);
      } else if (data) {
        setSheets(data);
        setPreviewLoading(false);
      } else {
        handleError('Could not read spreadsheet file');
      }
    },
    [setSheets, handleError, setPreviewLoading]
  );

  useEffect(() => {
    setPreviewLoading(true);
    void retrieveFile(downloadUrl, mimeType, extractExcelDataFromWorkbook, () =>
      handleError('Could not download spreadsheet file')
    );
  }, [
    extractExcelDataFromWorkbook,
    handleError,
    setPreviewLoading,
    downloadUrl,
    mimeType,
    retrieveFile,
  ]);

  return previewLoading ? (
    <PreviewLoading />
  ) : sheets.length < 1 ? null : (
    <SpreadsheetView data={sheets} />
  );
};

async function convertToHtml(
  file: File
): Promise<{
  data: Sheet[] | undefined;
  error: Error | undefined;
}> {
  try {
    const spreadsheetBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(spreadsheetBuffer, { type: 'buffer' });
    const data = workbook.SheetNames.reduce(
      (sheets: Sheet[], worksheetName) => {
        const worksheet = workbook.Sheets[worksheetName];
        // '!ref' is a special key that gives the used cell range
        const usedCellRange = worksheet['!ref'];
        const html = usedCellRange
          ? XLSX.utils.sheet_to_html(worksheet, {
              header: '',
              footer: '',
            })
          : `<h2>Empty Sheet</h2>`;
        const newSheet = {
          name: worksheetName,
          html: parse(html),
        };
        return sheets.concat(newSheet);
      },
      []
    );
    return data.length > 0
      ? { data, error: undefined }
      : {
          data: undefined,
          error: new Error('Could not read spreadsheet data'),
        };
  } catch (error) {
    console.log('error', error);
    return {
      data: undefined,
      error: new Error('Could not open spreadsheet file'),
    };
  }
}
