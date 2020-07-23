import React, { FC, useEffect, useState } from 'react';
import XLSX, { XLSX$Utils } from 'xlsx';
import { PreviewerProps } from './FilePreview';
import { usePreview } from './PreviewContext';
import { useRetrieveFile } from './useRetrieveFile';

type ColumnData = Array<{
  name: ReturnType<XLSX$Utils['encode_col']>;
  key: number;
}>;
type RowData = ReturnType<XLSX$Utils['sheet_to_json']>;

interface DataTableProps {
  columns: ColumnData;
  rows: RowData;
}

export const DataTable: FC<DataTableProps> = (props) => {
  const { columns, rows } = props;
  return (
    <div>
      <table className="tableClassName">
        <tbody>
          <tr>
            {columns.map((column) => {
              const { key, name } = column;
              return (
                <th
                  key={key}
                  className={key === -1 ? 'tableHeaderRowClass' : ''}
                >
                  {key === -1 ? '' : name}
                </th>
              );
            })}
          </tr>
          {rows.map((row, index) => (
            <tr key={index}>
              <td key={index} className="tableHeaderRowClass">
                {index}
              </td>
              {columns.map((column) => (
                <td key={column.key}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ExcelPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [rows, setRows] = useState<ColumnData>([]);
  const [columns, setColumns] = useState<RowData>([]);
  const { setError } = usePreview();
  const retrieveFile = useRetrieveFile(() =>
    setError('Could not download spreadsheet file')
  );

  useEffect(() => {
    retrieveFile(downloadUrl)
      .then((file) => {
        if (file) {
          renderExcelData(file).then(({ data, error }) => {
            if (error) {
              setError(error.message);
            } else if (data) {
              setRows(data.rows);
              setColumns(data.columns);
            } else {
              setError('Could not read spreadsheet file');
            }
          });
        } else {
          setError('Could not download spreadsheet file');
        }
      })
      .catch((error) => console.error(error));
  }, [setError, downloadUrl, retrieveFile]);

  return rows.length < 1 || columns.length < 1 ? null : (
    <DataTable rows={rows} columns={columns} />
  );
};

async function renderExcelData(
  file: File
): Promise<{
  data: { rows: RowData; columns: ColumnData } | undefined;
  error: Error | undefined;
}> {
  try {
    const spreadsheetBinary = await file.arrayBuffer();
    const workbook = XLSX.read(spreadsheetBinary, { type: 'buffer' });
    // Only doing first worksheet for now
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // '!ref' is a special key that gives the used cell range
    const usedCellRange = worksheet['!ref'];
    if (!usedCellRange) {
      return {
        data: undefined,
        error: new Error('Could not retrieve cell data for spreadsheet'),
      };
    }
    const columns = formatColumns(usedCellRange);
    const data = { rows, columns };
    return { data, error: undefined };
  } catch (error) {
    console.log(error);
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
