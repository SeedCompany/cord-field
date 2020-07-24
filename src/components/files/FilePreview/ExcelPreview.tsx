import { makeStyles } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import XLSX, { XLSX$Utils } from 'xlsx';
import { PreviewerProps } from './FilePreview';
import { usePreview } from './PreviewContext';
import { useRetrieveFile } from './useRetrieveFile';

const useStyles = makeStyles(() => {
  const backgroundColor = '#e6e6e6';
  const borderColor = '#d8d8df';
  const headerBorderColor = '#d1cacb';
  return {
    excelTable: {
      border: `1px solid ${headerBorderColor}`,
      borderCollapse: 'collapse',
      borderSpacing: '0px',
      borderWidth: '1px 0px 0px 1px',
      fontFamily: 'Arial',
    },
    cell: {
      backgroundColor: 'white',
      border: `1px solid ${borderColor}`,
      borderWidth: '0px 1px 1px 0px',
      padding: '2px 4px',
    },
    heading: {
      backgroundColor: backgroundColor,
      border: `1px solid ${headerBorderColor}`,
      borderWidth: '0px 1px 1px 0px',
      textAlign: 'center',
    },
  };
});

type ColumnData = Array<{
  name: ReturnType<XLSX$Utils['encode_col']>;
  key: number;
}>;
type RowData = ReturnType<XLSX$Utils['sheet_to_json']>;

interface DataTableProps {
  columns: ColumnData;
  rows: RowData;
}

export const SpreadsheetView: FC<DataTableProps> = (props) => {
  const { columns, rows } = props;
  const classes = useStyles();
  return (
    <div>
      <table className={classes.excelTable}>
        <tbody>
          <tr>
            {columns.map((column) => {
              const { key, name } = column;
              return (
                <th key={key} className={classes.heading}>
                  {name}
                </th>
              );
            })}
          </tr>
          {rows.map((row, index) => (
            <tr key={index}>
              <td key={index} className={classes.heading}>
                {index}
              </td>
              {columns.map((column) => (
                <td key={column.key} className={classes.cell}>
                  {row[column.key]}
                </td>
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
  const { setPreviewError } = usePreview();
  const retrieveFile = useRetrieveFile();

  useEffect(() => {
    retrieveFile(downloadUrl, () =>
      setPreviewError('Could not download spreadsheet file')
    ).then((file) => {
      if (file) {
        renderExcelData(file).then(({ data, error }) => {
          if (error) {
            setPreviewError(error.message);
          } else if (data) {
            setRows(data.rows);
            setColumns(data.columns);
          } else {
            setPreviewError('Could not read spreadsheet file');
          }
        });
      } else {
        setPreviewError('Could not download spreadsheet file');
      }
    });
  }, [setPreviewError, downloadUrl, retrieveFile]);

  return rows.length < 1 || columns.length < 1 ? null : (
    <SpreadsheetView rows={rows} columns={columns} />
  );
};

async function renderExcelData(
  file: File
): Promise<{
  data: { rows: RowData; columns: ColumnData } | undefined;
  error: Error | undefined;
}> {
  try {
    const spreadsheetBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(spreadsheetBuffer, { type: 'buffer' });
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
