import * as XLSX from 'xlsx';
import { PreviewerProps } from '../FilePreview';
import { useFilePreview } from '../useFilePreview';
import {
  jsonToTableRows,
  SheetData,
  SpreadsheetView,
  TableCellData,
  TableRow,
} from './SpreadsheetView';

export const ExcelPreview = (props: PreviewerProps) => {
  const sheets = useFilePreview(props.file, extractExcelData);
  return <SpreadsheetView data={sheets} />;
};

interface TableSpan {
  startColumn: number;
  startRow: number;
  colspan: number;
  rowspan: number;
}

async function extractExcelData(file: Blob): Promise<SheetData[]> {
  const spreadsheetBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(spreadsheetBuffer, { type: 'buffer' });
  const data = Object.entries(workbook.Sheets).flatMap(([name, worksheet]) => {
    // '!ref' is a special key that gives the used cell range
    const usedCellRange = worksheet['!ref'];
    const hidden =
      (workbook.Workbook?.Sheets?.find((s) => s.name === name)?.Hidden ?? 0) >
      0;
    if (!usedCellRange || hidden) {
      return [];
    }

    const mergedCells = worksheet['!merges'];

    /* `!merges` gives us the values in absolute terms, from column A
          and row 1. But `sheet_to_json` uses the `usedCellRange`, which
          trims off empty rows and columns. So we need to figure out an
          offset to use when calculating where the merged cells actually
          occur in the resulting JSON. */
    const range = XLSX.utils.decode_range(usedCellRange);
    /**
     * The `decode_range` util provides an object of this shape:
     *
     * {
     *   e: { c: 13, r: 38, },
     *   s: { c: 1, r: 3, },
     * }
     *
     * Translated into a sensible naming convention:
     *
     * {
     *   end: { column: 13, row: 38, },
     *   start: { column: 1, row: 3, },
     * }
     */
    const columnOffset = range.s.c;
    const rowOffset = range.s.r;

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
    return {
      name,
      rows,
      columns,
    };
  });
  if (data.length === 0) {
    throw new Error('Could not read spreadsheet data');
  }
  return data;
}

function formatColumns(usedCellRange: string) {
  const range = XLSX.utils.decode_range(usedCellRange);
  /**
   * The `decode_range` util provides an object of this shape:
   *
   * {
   *   e: { c: 13, r: 38, },
   *   s: { c: 1, r: 3, },
   * }
   *
   * Translated into a sensible naming convention:
   *
   * {
   *   end: { column: 13, row: 38, },
   *   start: { column: 1, row: 3, },
   * }
   */
  const numberOfColumns = range.e.c - range.s.c;
  const columns = Array(numberOfColumns + 1)
    .fill(undefined)
    .map((_, index) => ({ name: XLSX.utils.encode_col(index), key: index }));
  return columns;
}

function calculateMergedCells(
  rows: TableCellData[][],
  spans: TableSpan[]
): TableRow[] {
  /**
   * First we need to convert `spans` into a list of actual row/column
   * numbers that we can check each row/column item in the `rows` array
   * against to see if it should be spanned in the HTML table
   */
  interface SpannedCell {
    column: number;
    row: number;
  }
  const messySpannedCells = spans.reduce((spanned: SpannedCell[], span) => {
    const { startColumn, startRow, colspan, rowspan } = span;
    const merges = Array(rowspan)
      .fill(undefined)
      .reduce((mergedCells: SpannedCell[], _, rowIndex) => {
        const mergedColumns = Array(colspan)
          .fill(undefined)
          .map((_, columnIndex) => ({
            row: startRow + rowIndex,
            column: startColumn + columnIndex,
          }));
        return mergedCells.concat(mergedColumns);
      }, []);
    /**
     * `merges` includes the cell where the merge starts, but
     * we want to exclude it.
     */
    const mergesWithoutOrigin = merges.filter(
      (merge) => merge.row !== startRow || merge.column !== startColumn
    );
    return spanned.concat(mergesWithoutOrigin);
  }, []);
  /**
   * It probably wouldn't hurt us much to let there be some
   * duplicates, but let's be tidy.
   */
  const spannedCells = [...new Set(messySpannedCells)];
  const mergedRows = rows.map((columns, rowIndex) => {
    const mergedColumns = columns.map((column, columnIndex) => {
      const isSpanned = spannedCells.find(
        (spannedCell) =>
          spannedCell.row === rowIndex && spannedCell.column === columnIndex
      );
      if (isSpanned) {
        return {
          index: columnIndex,
          spanned: true as const,
        };
      }
      const { rowspan, colspan, content } = column;
      const cellSpan = spans.find(
        (span) => span.startColumn === columnIndex && span.startRow === rowIndex
      );
      return {
        index: columnIndex,
        rowspan: cellSpan ? cellSpan.rowspan : rowspan,
        colspan: cellSpan ? cellSpan.colspan : colspan,
        content,
      };
    });
    return mergedColumns as TableRow;
  });
  return mergedRows;
}

// eslint-disable-next-line import/no-default-export
export default ExcelPreview;
