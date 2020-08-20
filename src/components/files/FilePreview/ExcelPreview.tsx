import React, { FC, useCallback, useEffect, useState } from 'react';
import XLSX from 'xlsx';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { SheetData, SpreadsheetView, TableSpan } from './SpreadsheetView';

export const ExcelPreview: FC<PreviewerProps> = (props) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [sheets, setSheets] = useState<SheetData[]>([]);

  const extractExcelDataFromWorkbook = useCallback(
    async (file: File) => {
      const { data, error } = await extractExcelData(file);
      if (error) {
        setPreviewError(error.message);
      } else if (data) {
        setSheets(data);
        setPreviewLoading(false);
      } else {
        setPreviewError('Could not read spreadsheet file');
      }
    },
    [setSheets, setPreviewError, setPreviewLoading]
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
        if (!usedCellRange) {
          return sheets.concat({
            name: worksheetName,
            rows: [],
            columns: [],
            spans: [],
          });
        }

        const mergedCells = worksheet['!merges'];

        /* `!merges` gives us the values in absolute terms, from column A
          and row 1. But `sheet_to_json` uses the `usedCellRange`, which
          trims off empty rows and columns. So we need to figure out an
          offset to use when calculating where the merged cells actually
          occur in the resulting JSON. */
        const rangeStart = usedCellRange.split(':')[0].split(/[A-Z]+/);
        const rangeStartColumn = Array.from(rangeStart[0]);

        const columnOffset =
          rangeStartColumn.reduce(
            (offset: number, component, index) => {
              // 41 is 'A', and we want an `indexValue` for 'A' to be 1
              const indexValue = component.charCodeAt(0) - 40;
              /* For a `rangeStartColumn` value of 'AAA' and an `index` of 0,
            we want `power` to be 2. */
              const power = rangeStartColumn.length - index - 1;
              const componentValue = 26 ** power + indexValue;
              return componentValue + offset;
            },
            0
            // We subtract 1 because spreadsheets start at 1 but we start at 0.
          ) - 1;
        const rowOffset = Number(rangeStart[1]) - 1;
        const spans =
          mergedCells?.reduce((spans: TableSpan[], merge) => {
            const startColumn = merge.s.c - columnOffset;
            const startRow = merge.s.r - rowOffset;
            const colspan = merge.e.c - merge.s.c + 1;
            const rowspan = merge.e.r - merge.s.r + 1;
            const span: TableSpan = {
              startColumn,
              startRow,
              colspan,
              rowspan,
            };
            return spans.concat(span);
          }, []) ?? [];
        const newSheet = {
          name: worksheetName,
          rows: XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }),
          columns: formatColumns(usedCellRange),
          spans,
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
