import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { XLSX$Utils } from 'xlsx';

const useStyles = makeStyles()(() => {
  const backgroundColor = '#e6e6e6';
  const borderColor = '#d8d8df';
  const headerBorderColor = '#d1cacb';
  const headerStyles = {
    backgroundColor: backgroundColor,
    border: `1px solid ${headerBorderColor}`,
    borderWidth: '0px 1px 1px 0px',
    textAlign: 'center',
  } as const;
  return {
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

export interface TableCellSpanned {
  index: number;
  spanned: true;
}

export interface TableCellData {
  index: number;
  spanned: false;
  rowspan: number;
  colspan: number;
  content: string | number;
}

export type TableRow = Array<TableCellSpanned | TableCellData>;

export interface SheetData {
  name: string;
  rows: TableRow[];
  columns: ColumnData;
}

interface SpreadSheetViewProps {
  data: SheetData[];
}

export function jsonToTableRows(rows: RowData): TableCellData[][] {
  return rows.map((row: RowData[0]) =>
    row.map((cell: any, index: number) => ({
      index,
      spanned: false,
      rowspan: 1,
      colspan: 1,
      content: typeof cell === 'number' ? cell : String(cell),
    }))
  );
}

const RenderedSheet = (props: Omit<SheetData, 'name'>) => {
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
        {rows.map((cells, rowIndex) => {
          return (
            <tr key={rowIndex}>
              <th className="table-header">{rowIndex + 1}</th>
              {cells.map((cell) => {
                if (cell.spanned) return null;
                const { index, rowspan, colspan, content } = cell;
                return (
                  <td key={index} rowSpan={rowspan} colSpan={colspan}>
                    {content}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export const SpreadsheetView = (props: SpreadSheetViewProps) => {
  const { classes } = useStyles();
  const { data } = props;
  const [activeTab, setActiveTab] = useState(0);

  return data.length === 1 ? (
    <div className={classes.container}>
      <RenderedSheet rows={data[0]!.rows} columns={data[0]!.columns} />
    </div>
  ) : (
    <>
      <Tabs
        value={activeTab}
        onChange={(_, tab) => setActiveTab(tab)}
        aria-label="Spreadsheet tabs"
      >
        {data.map((sheet, index) => (
          <Tab
            key={sheet.name}
            label={sheet.name}
            id={`sheet-tab-${index}`}
            aria-controls={`sheet-tabpanel-${index}`}
          />
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
