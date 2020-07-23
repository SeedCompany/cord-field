import React, { FC, useEffect, useState } from 'react';
import XLSX, { XLSX$Utils } from 'xlsx';
import { PreviewerProps } from './FilePreview';
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
  const retrieveFile = useRetrieveFile();

  useEffect(() => {
    retrieveFile(downloadUrl)
      .then((file) => {
        if (file) {
          renderExcelData(file).then(({ data, error }) => {
            if (error) {
              // TODO display error component
              console.error(error);
            } else if (data) {
              setRows(data.rows);
              setColumns(data.columns);
            } else {
              console.error(new Error('Could not read spreadsheet file'));
            }
          });
        } else {
          console.error(new Error('Could not download spreadsheet file'));
        }
      })
      .catch((error) => console.error(error));
  }, [downloadUrl, retrieveFile]);

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
    return { data: undefined, error };
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

// import React, { Component } from 'react';
// import XLSX from 'xlsx';

// export class OutTable extends Component {

// 	constructor(props) {
//         super(props);
//         this.state = {

//         }
//     }

// 	render() {
//         return (
// <div>
//     <table className={this.props.tableClassName}  >
//         <tbody>
//             <tr>
//                 {
//                     this.props.columns.map((c) =>
//                         <th key={c.key} className={c.key === -1 ? this.props.tableHeaderRowClass : ""}>{c.key === -1 ? "" : c.name}</th>
//                     )

//                 }
//             </tr>
//             {this.props.data.map((r,i) => <tr key={i}><td key={i} className={this.props.tableHeaderRowClass}>{i}</td>
//                 {this.props.columns.map(c => <td key={c.key}>{ r[c.key] }</td>)}
//             </tr>)}
//         </tbody>
//     </table>
// </div>
//         );
//     }
// }

// export function ExcelRenderer(file, callback) {
//     return new Promise(function(resolve, reject) {
//       var reader = new FileReader();
//       var rABS = !!reader.readAsBinaryString;
//       reader.onload = function(e) {
//         /* Parse data */
//         var bstr = e.target.result;
//         var wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });

//         /* Get first worksheet */
//         var wsname = wb.SheetNames[0];
//         var ws = wb.Sheets[wsname];

//         /* Convert array of arrays */
//         var json = XLSX.utils.sheet_to_json(ws, { header: 1 });
//         var cols = make_cols(ws["!ref"]);

//         var data = { rows: json, cols: cols };

//         resolve(data);
//         return callback(null, data);
//       };
//       if (file && rABS) reader.readAsBinaryString(file);
//       else reader.readAsArrayBuffer(file);
//     });
//   }

//   function make_cols(refstr) {
//     var o = [],
//       C = XLSX.utils.decode_range(refstr).e.c + 1;
//     for (var i = 0; i < C; ++i) {
//       o[i] = { name: XLSX.utils.encode_col(i), key: i };
//     }
//     return o;
//   }
