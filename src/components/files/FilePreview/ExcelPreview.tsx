import React, { FC, useCallback, useEffect, useState } from 'react';
import XLSX from 'xlsx';
import { usePreview, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { PreviewPagination } from './PreviewPagination';
import { ColumnData, RowData, SpreadsheetView } from './SpreadsheetView';
import { useRetrieveFile } from './useRetrieveFile';

interface SheetData {
  name: string;
  rows: RowData;
  columns: ColumnData;
}

export const ExcelPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const { previewPage, previewLoading, setPreviewLoading } = usePreview();
  const retrieveFile = useRetrieveFile();
  const handleError = usePreviewError();

  const extractExcelDataFromWorkbook = useCallback(
    async (file: File) => {
      const { data, error } = await extractExcelData(file);
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
    retrieveFile(downloadUrl, extractExcelDataFromWorkbook, () =>
      handleError('Could not download spreadsheet file')
    );
  }, [
    extractExcelDataFromWorkbook,
    handleError,
    setPreviewLoading,
    downloadUrl,
    retrieveFile,
  ]);

  const currentSheet = sheets[previewPage - 1];

  return !previewLoading && sheets.length < 1 ? null : (
    <PreviewPagination pageCount={sheets.length}>
      {previewLoading ? (
        <PreviewLoading />
      ) : (
        <SpreadsheetView {...currentSheet} />
      )}
    </PreviewPagination>
  );
};

async function extractExcelData(
  file: File
): Promise<{
  data: SheetData[] | undefined;
  error: Error | undefined;
}> {
  try {
    const spreadsheetBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(spreadsheetBuffer, { type: 'buffer' });
    const data = workbook.SheetNames.reduce(
      (sheets: SheetData[], worksheetName) => {
        const worksheet = workbook.Sheets[worksheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // '!ref' is a special key that gives the used cell range
        const usedCellRange = worksheet['!ref'];
        const columns = usedCellRange ? formatColumns(usedCellRange) : [];
        const newSheet = usedCellRange
          ? { name: worksheetName, rows, columns }
          : { name: 'Unreadable Sheet', rows: [], columns };
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
  } catch {
    return {
      data: undefined,
      error: new Error('Could not open spreadsheet file'),
    };
  }
}

function formatColumns(usedCellRange: string) {
  const columns = [],
    cellAddress = XLSX.utils.decode_range(usedCellRange).e.c;
  for (let i = 0; i <= cellAddress; ++i) {
    columns[i] = { name: XLSX.utils.encode_col(i), key: i };
  }
  return columns;
}
