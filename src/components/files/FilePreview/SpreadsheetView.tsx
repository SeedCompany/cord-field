import { makeStyles, Tab, Tabs } from '@material-ui/core';
import React, { FC, useEffect } from 'react';
import { XLSX$Utils } from 'xlsx';
import { useFileActions } from '../FileActions';

const useStyles = makeStyles(({ spacing }) => {
  const backgroundColor = '#e6e6e6';
  const borderColor = '#d8d8df';
  const headerBorderColor = '#d1cacb';
  const headerStyles = {
    backgroundColor: backgroundColor,
    border: `1px solid ${headerBorderColor}`,
    borderWidth: '0px 1px 1px 0px',
    textAlign: 'center',
  };
  return {
    sheetHeader: {
      marginBottom: spacing(2),
    },
    container: {
      '& h2': {
        fontFamily: 'Arial',
        fontWeight: 'normal',
        textAlign: 'center',
      },
      '& table': {
        border: `1px solid ${headerBorderColor}`,
        borderCollapse: 'collapse',
        borderSpacing: '0px',
        borderWidth: '1px 0px 0px 1px',
        fontFamily: 'Arial',
      },
      '& th': {
        ...headerStyles,
      },
      '& .table-header': {
        ...headerStyles,
      },
      '& td': {
        backgroundColor: 'white',
        border: `1px solid ${borderColor}`,
        borderWidth: '0px 1px 1px 0px',
        padding: '2px 4px',
      },
    },
  };
});

/* Using typings from `xlsx` here because we want to play it
   safe when we use these typings in the `ExcelPreview` component */
export type ColumnData = Array<{
  name: ReturnType<XLSX$Utils['encode_col']>;
  key: number;
}>;
export type RowData = ReturnType<XLSX$Utils['sheet_to_json']>;

export interface SheetData {
  name: string;
  rows: RowData;
  columns: ColumnData;
}

interface SpreadSheetViewProps {
  data: SheetData[];
}

const RenderedSheet: FC<Omit<SheetData, 'name'>> = (props) => {
  const { rows, columns } = props;
  return (
    <table>
      <tbody>
        <tr>
          <th>&nbsp;</th>
          {columns.map((column) => {
            const { key, name } = column;
            return <th key={key}>{name}</th>;
          })}
        </tr>
        {rows.map((row, index) => (
          <tr key={index}>
            <td key={index} className="table-header">
              {index}
            </td>
            {columns.map((column) => (
              <td key={column.key}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const SpreadsheetView: FC<SpreadSheetViewProps> = (props) => {
  const classes = useStyles();
  const { data } = props;
  const { previewPage, setPreviewPage } = useFileActions();

  useEffect(() => {
    return () => setPreviewPage(1);
  }, [setPreviewPage]);

  function a11yProps(index: number) {
    return {
      id: `sheet-tab-${index}`,
      'aria-controls': `sheet-tabpanel-${index}`,
    };
  }

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPreviewPage(value + 1);
  };

  const activeTab = previewPage - 1;
  return data.length === 1 ? (
    <div className={classes.container}>
      <RenderedSheet rows={data[0].rows} columns={data[0].columns} />
    </div>
  ) : (
    <>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        aria-label="Spreadsheet tabs"
      >
        {data.map((sheet, index) => (
          <Tab key={sheet.name} label={sheet.name} {...a11yProps(index)} />
        ))}
      </Tabs>
      {data.map((sheet, index) => {
        const { name, rows, columns } = sheet;
        return (
          <div
            key={name}
            aria-labelledby={`sheet-tab-${index}`}
            className={classes.container}
            hidden={activeTab !== index}
            id={`sheet-tabpanel-${index}`}
            role="tabpanel"
          >
            {activeTab === index && columns.length > 0 ? (
              <RenderedSheet rows={rows} columns={columns} />
            ) : null}
          </div>
        );
      })}
    </>
  );
};
