import React, { FC, useCallback, useEffect, useState } from 'react';
import XLSX from 'xlsx';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { ColumnData, RowData, SpreadsheetView } from './SpreadsheetView';

interface SheetData {
  name: string;
  rows: RowData;
  columns: ColumnData;
}

export const ExcelPreview: FC<PreviewerProps> = ({ file }) => {
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const { previewLoading, setPreviewLoading } = useFileActions();
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
    if (file) {
      void extractExcelDataFromWorkbook(file);
    }
  }, [file, extractExcelDataFromWorkbook]);

  return previewLoading ? (
    <PreviewLoading />
  ) : sheets.length < 1 ? null : (
    <SpreadsheetView data={sheets} />
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
        // '!ref' is a special key that gives the used cell range
        const usedCellRange = worksheet['!ref'];
        const newSheet = {
          name: worksheetName,
          rows: usedCellRange
            ? XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            : [],
          columns: usedCellRange ? formatColumns(usedCellRange) : [],
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
  } catch {
    return {
      data: undefined,
      error: new Error('Could not open spreadsheet file'),
    };
  }
}

function formatColumns(usedCellRange: string) {
  const cellAddress = XLSX.utils.decode_range(usedCellRange).e.c;
  const columns = Array(cellAddress)
    .fill(null)
    .map((_, index) => ({ name: XLSX.utils.encode_col(index), key: index }));
  return columns;
}
