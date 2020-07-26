import { makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { ColumnData, RowData } from './ExcelPreview';

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

interface SpreadsheetViewProps {
  columns: ColumnData;
  name?: string;
  rows: RowData;
}

export const SpreadsheetView: FC<SpreadsheetViewProps> = (props) => {
  const { columns, name, rows } = props;
  const classes = useStyles();
  return (
    <div>
      {name && (
        <Typography variant="h3" className={classes.sheetHeader}>
          {name}
        </Typography>
      )}
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
