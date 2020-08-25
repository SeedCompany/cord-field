import React, { FC, useCallback, useEffect, useState } from 'react';
import XLSX from 'xlsx';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import {
  RowData,
  SheetData,
  SpreadsheetView,
  TableRow,
} from './SpreadsheetView';

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

interface TableSpan {
  startColumn: number;
  startRow: number;
  colspan: number;
  rowspan: number;
}

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
          });
        }

        const mergedCells = worksheet['!merges'];

        /* `!merges` gives us the values in absolute terms, from column A
          and row 1. But `sheet_to_json` uses the `usedCellRange`, which
          trims off empty rows and columns. So we need to figure out an
          offset to use when calculating where the merged cells actually
          occur in the resulting JSON. */
        const rangeStart = usedCellRange.split(':')[0];
        const rangeStartColumn = rangeStart[0].match(/[A-Z]+/g)![0];
        const rangeStartRow = rangeStart.split(rangeStartColumn)[1];

        const columnOffset =
          Array.from(rangeStartColumn).reduce(
            (offset: number, component, index) => {
              // 65 is 'A', and we want an `indexValue` for 'A' to be 1
              const indexValue = component.charCodeAt(0) - 64;
              /* For a `rangeStartColumn` value of 'AAA' and an `index` of 0,
            we want `power` to be 2. */
              const power = rangeStartColumn.length - index - 1;
              const componentValue =
                power > 0 ? 26 ** power + indexValue : indexValue;
              return componentValue + offset;
            },
            0
            // We subtract 1 because spreadsheets start at 1 but we start at 0.
          ) - 1;
        const rowOffset = Number(rangeStartRow) - 1;
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
        const convertedRows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        });
        const rows = calculateMergedRows(convertedRows, spans);
        const columns = formatColumns(usedCellRange);
        const newSheet = {
          name: worksheetName,
          rows,
          columns,
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
  const columns = Array(cellAddress + 1)
    .fill(undefined)
    .map((_, index) => ({ name: XLSX.utils.encode_col(index), key: index }));
  return columns;
}

function calculateMergedRows(rows: RowData, spans: TableSpan[]): TableRow[] {
  return rows.reduce((mergedRows: TableRow[], currentRow, rowIndex) => {
    if (mergedRows[rowIndex]) {
      return mergedRows;
    }
    const rowMerges: TableSpan[] = currentRow.reduce(
      (merges: TableSpan[], _: any, ci: number) => {
        const cellMerge = spans.find(
          (span) =>
            span.startColumn === ci &&
            span.startRow === rowIndex &&
            span.rowspan > 1
        );
        return !cellMerge ? merges : merges.concat(cellMerge);
      },
      []
    );

    const subsequentMergedRows = rowMerges.map((rowMerge) => {
      const { rowspan, startColumn, colspan } = rowMerge;
      const columnsToMerge = Array(colspan)
        .fill(undefined)
        .reduce(
          (columns: number[], __, i) => columns.concat(startColumn + i),
          []
        );
      return Array(rowspan - 1)
        .fill(undefined)
        .reduce((mergedRows, _, newRowIndex) => {
          const originalRowData = rows[rowIndex + newRowIndex + 1];
          const mergedRow = originalRowData.reduce(
            (mergedRow: TableRow, cell: RowData[0], cellIndex: number) => {
              const mergedCell = columnsToMerge.includes(cellIndex)
                ? {
                    index: cellIndex,
                    spanned: true as const,
                  }
                : {
                    index: cellIndex,
                    spanned: false as const,
                    rowspan: 1,
                    colspan: 1,
                    content: String(cell),
                  };
              return mergedRow.concat(mergedCell);
            },
            []
          );
          return [...mergedRows, mergedRow];
        }, []);
    });

    const mergedColumns = currentRow.reduce(
      (mergedColumns: TableRow, column: any, columnIndex: number) => {
        if (mergedColumns[columnIndex]?.spanned) {
          return mergedColumns;
        }

        const columnMerge = spans.find(
          (span) =>
            span.startColumn === columnIndex && span.startRow === rowIndex
        );

        if (!columnMerge) {
          return [
            ...mergedColumns,
            {
              index: columnIndex,
              spanned: false as const,
              rowspan: 1,
              colspan: 1,
              content: column,
            },
          ];
        }

        const { colspan, rowspan } = columnMerge;
        const currentColumnData = {
          index: columnIndex,
          spanned: false as const,
          rowspan,
          colspan,
          content: column,
        };
        const spannedColumns = Array(colspan - 1)
          .fill(undefined)
          .map((_, index) => ({
            index,
            spanned: true as const,
          }));
        return [...mergedColumns, currentColumnData, ...spannedColumns];
      },
      []
    );
    return [...mergedRows, mergedColumns, ...subsequentMergedRows.flat()];
  }, []);
}
