import React, { FC, useCallback, useEffect, useState } from 'react';
import XLSX from 'xlsx';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import {
  jsonToTableRows,
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
        const parsedRows = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
        });
        const convertedRows = jsonToTableRows(parsedRows);
        const rows = calculateMergedCells(convertedRows, spans);
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

function calculateMergedCells(
  rows: TableRow[],
  spans: TableSpan[]
): TableRow[] {
  return rows.reduce((mergedRows: TableRow[], currentRow, rowIndex) => {
    /**
     * If this row already exists, that means somewhere lower down we
     * have processed it completely, so it should be returned as-is.
     */
    if (mergedRows[rowIndex]) {
      return mergedRows;
    }

    // Mark any column-spanned cells in this row as `spanned`
    const mergedRow = getMergedColumns(currentRow, rowIndex, spans);

    /**
     * Now we need a snapshot of all the rows we've modified
     * up until now, together with all remaining unprocessed
     * rows. We're going to pass that snapshot recursively
     * back, in case any of the cells we've already processed
     * have their own merged rows that need to be processed
     * in
     */
    const rowsSnapshot = [
      ...mergedRows.slice(0, rowIndex),
      mergedRow,
      ...mergedRows.slice(rowIndex + 1),
      ...rows.slice(mergedRows.length + 1),
    ];

    // Find cells in this row that have `rowspan` > 1
    console.log(`Getting merged rows for row ${rowIndex + 1}`);
    const rowMergesForCurrentRow = findRowMergesForCurrentRow(
      currentRow,
      rowIndex,
      spans
    );

    const subsequentMergedRows = getSubsequentMergedRows(
      rowMergesForCurrentRow,
      rowIndex,
      rowsSnapshot,
      spans
    );

    return [
      ...mergedRows.slice(0, rowIndex),
      mergedRow,
      ...subsequentMergedRows,
      ...mergedRows.slice(rowIndex + 1 + subsequentMergedRows.length),
    ];
  }, []);
}

/**
 * Whether we're calling it from the main loop or later while
 * processing merged rows, we need to process the "current" row
 * for column merges.
 */
function getMergedColumns(
  currentRow: TableRow,
  rowIndex: number,
  spans: TableSpan[]
): TableRow {
  return currentRow.reduce((mergedColumns: TableRow, column, columnIndex) => {
    /**
     * Some function already decided this cell would be spanned;
     * return it still spanned.
     * */
    if (mergedColumns[columnIndex]?.spanned || column.spanned) {
      return [
        ...mergedColumns.slice(0, columnIndex),
        {
          index: columnIndex,
          spanned: true as const,
        },
        ...mergedColumns.slice(columnIndex + 1),
      ];
    }

    const columnMerge = spans.find(
      (span) => span.startColumn === columnIndex && span.startRow === rowIndex
    );

    if (!columnMerge) {
      return [
        ...mergedColumns.slice(0, columnIndex),
        {
          index: columnIndex,
          spanned: false as const,
          rowspan: 1,
          colspan: 1,
          content: column.content,
        },
        ...mergedColumns.slice(columnIndex + 1),
      ];
    }

    const { colspan, rowspan } = columnMerge;
    const currentColumnData = {
      index: columnIndex,
      spanned: false as const,
      rowspan,
      colspan,
      content: column.content,
    };
    const spannedColumns = Array(colspan - 1)
      .fill(undefined)
      .map((_, index) => ({
        index,
        spanned: true as const,
      }));
    return [...mergedColumns, currentColumnData, ...spannedColumns];
  }, []);
}

/**
 * We need to find any cell with `rowspan` > 1. We'll feed the list
 * of such row merges into a function that evaluates subsequent rows
 * and processes all of **their** merges, recursively.
 */
function findRowMergesForCurrentRow(
  row: TableRow,
  rowIndex: number,
  spans: TableSpan[]
): TableSpan[] {
  return row.reduce((merges: TableSpan[], _, ci) => {
    const cellMerge = spans.find(
      (span) =>
        span.startColumn === ci &&
        span.startRow === rowIndex &&
        span.rowspan > 1
    );
    return !cellMerge ? merges : merges.concat(cellMerge);
  }, []);
}

/**
 * This could really have been one function together with
 * `findRowMergesForCurrentRow`, but we're keeping them separate
 * for readability.
 *
 * The output of `findRowMergesForCurrentRow` is an array of cells
 * in the "current" row (whether the row from the main
 * `calculateMergedCells` function, or one of the subsequent rows
 * being evaluated in the loop of this function that called it
 * recursively) that have `rowspan` > 1. For each of those cells,
 * we need to evaluate any subsequent rows affected by the merged
 * row. They may, in turn, have cells with merged rows, requiring
 * us to call this function again.
 *
 * An example might be useful. Let us say we have a spreadsheet
 * that looks like this:
 *
 *  ┌───────────┬─────────────────┬─────┐
 *  │           │      C1-E1      │ F1  │
 *  │           │                 │     │
 *  │           ├───────────┬─────┴─────┤
 *  │   A1-B3   │           │   E2-F2   │
 *  │           │           │           │
 *  │           │   C2-D3   ├─────┬─────┤
 *  │           │           │     │ F3  │
 *  │           │           │     │     │
 *  ├─────┬─────┼─────┬─────┤E3-E4├─────┤
 *  │ A4  │ B4  │ C4  │ D4  │     │ F4  │
 *  │     │     │     │     │     │     │
 *  └─────┴─────┴─────┴─────┴─────┴─────┘
 *
 * We run `calculateMergedCells`. While processing row 1, it runs
 * `rowMergesForCurrentRow` and finds the merged rows of A1-B3
 * (which also includes merged columns). It passes the information
 * about that merge to `getSubsequentMergedRows`, which identifies
 * the rows below row 1 that need to be processed so their cells
 * that are merged into row 1 can be marked as spanned.
 *
 * While we are doing this processing, we also check for merged rows
 * in a recursive process. So when `getSubsequentMergedRows`
 * processes row 2, it calls `rowMergesForCurrentRow` and finds the
 * merged rows of C2-D3. This means it needs to process row 3, and
 * then it finds E3-E4.
 *
 * ALSO! When processing each row, `getSubsequentMergedRows` calls
 * `getMergedColumns` to make sure all column merges are evaluated.
 * This way, when a given row is finally handed all the way back
 * up to `calculateMergedCells`, it can be added to the accumulator
 * value without further modification. But this means that we always
 * need to be working with the most recently modified version of a row,
 * passing our recent edits forward with each recursive call to
 * `getSubsequentMergedRows` instead of constantly pulling from the
 * original rows passed in to `calculateMergedCells`.
 */
function getSubsequentMergedRows(
  rowMerges: TableSpan[],
  rowIndex: number,
  rowsSnapshot: TableRow[],
  spans: TableSpan[]
): TableRow[] {
  console.log(`row merges for row ${rowIndex + 1}`, rowMerges);
  const subsequentMergedRows = rowMerges.reduce(
    (subsequentRows: TableRow[], rowMerge) => {
      const { rowspan, startColumn, colspan } = rowMerge;
      /**
       * Which columns in this row merge extend beyond this
       * row into subsequent rows?
       */
      const columnsToMerge = Array(colspan)
        .fill(undefined)
        .reduce(
          (columns: number[], __, i) => columns.concat(startColumn + i),
          []
        );
      /**
       * We might have already made a pass through this `.reduce`
       * function and have new information that should replace
       * some of what we originally received in `rowsSnapshot`
       */
      const subsequentRowsSnapshot = [
        ...rowsSnapshot.slice(0, rowIndex + 1),
        ...subsequentRows,
        ...rowsSnapshot.slice(rowIndex + 1 + subsequentRows.length),
      ];
      const populatedRows = Array(rowspan - 1)
        .fill(undefined)
        .reduce((populatedMergedRows: TableRow[], _, newRowIndex) => {
          console.log(
            `Populating row ${
              rowIndex + 1 + newRowIndex + 1
            } from merge in row ${rowIndex + 1}`
          );
          /**
           * We need to know how to find the current row (`newRowIndex`
           * inside this block) in our `rowsSnapshot` so we can retrieve
           * its values from whichever place has the more recently
           * modified data.
           */
          const originalIndex = rowIndex + newRowIndex + 1;

          /**
           * If we already processed a row directly from `rows` in a
           * previous pass but it contains more than one merged row, we
           * want to modify our previous modification, not the original.
           */
          const currentRowData =
            subsequentRows[newRowIndex] ??
            subsequentRowsSnapshot[originalIndex];
          // Calculate all the column merges isolated to this row
          const mergedColumnsCurrentRowData = getMergedColumns(
            currentRowData,
            originalIndex,
            spans
          );

          /**
           * Now that we have the column merges calculated, we need to
           * identify any cells in this row that are affected by a row
           * merge from higher up. Some of those cells may already be
           * marked as `spanned` from a previous pass; if so, our work is
           * done! Otherwise we'll check against our list of columns in
           * this row that ought to be merged.
           */
          const mergedRow = mergedColumnsCurrentRowData.reduce(
            (mergedRow: TableRow, cell: TableRow[0], cellIndex: number) => {
              const mergedCell = columnsToMerge.includes(cellIndex)
                ? {
                    index: cellIndex,
                    spanned: true as const,
                  }
                : cell;
              const newMergedRow = mergedRow.concat(mergedCell);
              return newMergedRow;
            },
            []
          );

          /**
           * Now that all necessary cells in this row have been marked
           * as spanned, we need to check for any row merges in it that
           * require the processing of rows below it. This is where we
           * make our recursive call to `getSubsequentMergedRows`, so we
           * need the same kind of data here that we made from the top-
           * level function that calls it: a snapshot of all currently
           * processed rows, the current row we want to evalaute for
           * row merges, and the index of that row in the full list of
           * rows.
           */
          const mergedRowsSnapshot = [
            ...subsequentRowsSnapshot.slice(0, rowIndex + 1),
            ...populatedMergedRows.slice(0, newRowIndex),
            mergedRow,
            ...populatedMergedRows.slice(newRowIndex + 1),
            ...subsequentRowsSnapshot.slice(
              rowIndex + 1 + populatedMergedRows.length + 1
            ),
          ];
          console.log(
            `Getting merged rows for row ${originalIndex + 1} from row ${
              rowIndex + 1
            }`,
            mergedRow
          );
          const mergesForSubsequentRow = findRowMergesForCurrentRow(
            mergedRow,
            originalIndex,
            spans
          );

          const subSubsequentRows = getSubsequentMergedRows(
            mergesForSubsequentRow,
            originalIndex,
            mergedRowsSnapshot,
            spans
          );
          const newPopulatedRows = [
            ...populatedMergedRows.slice(0, newRowIndex),
            mergedRow,
            ...subSubsequentRows,
            ...populatedMergedRows.slice(
              newRowIndex + 1 + subSubsequentRows.length
            ),
          ];
          return newPopulatedRows;
        }, []);
      const populatedSubsequentRows = [
        // ...subsequentRows.slice(0, rowMergeIndex),
        ...populatedRows,
        // ...subsequentRows.slice(rowMergeIndex + 1 + populatedRows.length),
      ];
      console.log(
        `populatedSubsequentRows from row ${rowIndex + 1}`,
        populatedSubsequentRows
      );
      return populatedSubsequentRows;
    },
    []
  );
  return subsequentMergedRows;
}
