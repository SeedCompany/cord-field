import { makeStyles, Typography } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import XLSX, { XLSX$Utils } from 'xlsx';
import { PreviewerProps } from './FilePreview';
import { usePreview } from './PreviewContext';
import { PreviewPagination } from './PreviewPagination';
import { useRetrieveFile } from './useRetrieveFile';

const useStyles = makeStyles(({ spacing }) => {
  const backgroundColor = '#e6e6e6';
  const borderColor = '#d8d8df';
  const headerBorderColor = '#d1cacb';
  return {
    sheetHeader: {
      marginBottom: spacing(2),
    },
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
    tableHeader: {
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

interface SheetData {
  name: string;
  rows: RowData;
  columns: ColumnData;
}

interface DataTableProps {
  columns: ColumnData;
  name: string;
  rows: RowData;
}

export const SpreadsheetView: FC<DataTableProps> = (props) => {
  const { columns, name, rows } = props;
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h3" className={classes.sheetHeader}>
        {name}
      </Typography>
      <table className={classes.excelTable}>
        <tbody>
          <tr>
            {columns.map((column) => {
              const { key, name } = column;
              return (
                <th key={key} className={classes.tableHeader}>
                  {name}
                </th>
              );
            })}
          </tr>
          {rows.map((row, index) => (
            <tr key={index}>
              <td key={index} className={classes.tableHeader}>
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
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const { previewPage, setPreviewError } = usePreview();
  const retrieveFile = useRetrieveFile();

  useEffect(() => {
    retrieveFile(downloadUrl, () =>
      setPreviewError('Could not download spreadsheet file')
    ).then((file) => {
      if (file) {
        extractExcelData(file).then(({ data, error }) => {
          if (error) {
            setPreviewError(error.message);
          } else if (data) {
            setSheets(data);
          } else {
            setPreviewError('Could not read spreadsheet file');
          }
        });
      } else {
        setPreviewError('Could not download spreadsheet file');
      }
    });
  }, [setPreviewError, downloadUrl, retrieveFile]);

  const currentSheet = sheets[previewPage - 1];

  return sheets.length < 1 ? null : (
    <PreviewPagination pageCount={sheets.length}>
      <SpreadsheetView {...currentSheet} />
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
