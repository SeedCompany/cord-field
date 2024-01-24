import Papa from 'papaparse';
import { PreviewerProps } from '../FilePreview';
import { useFilePreview } from '../useFilePreview';
import {
  ColumnData,
  jsonToTableRows,
  SheetData,
  SpreadsheetView,
} from './SpreadsheetView';

export const CsvPreview = ({ file }: PreviewerProps) => {
  const csv = useFilePreview<SheetData[]>(file, async (data) => {
    const csvStr = await data.text();
    const parsed = Papa.parse<string[]>(csvStr);

    if (parsed.data.length === 0) {
      return [];
    }

    const columns = parsed.data[0]!.reduce(
      (columns: ColumnData, columnName, index) =>
        columns.concat({ name: columnName, key: index }),
      []
    );
    const rows = jsonToTableRows(parsed.data.slice(1));
    return [{ name: 'Sheet1', rows, columns }];
  });

  return <SpreadsheetView data={csv} />;
};

// eslint-disable-next-line import/no-default-export
export default CsvPreview;
