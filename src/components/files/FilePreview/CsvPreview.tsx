import { Grid } from '@material-ui/core';
import Papa, { ParseResult } from 'papaparse';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { SpreadsheetView } from './SpreadsheetView';

export const CsvPreview: FC<PreviewerProps> = ({ downloadUrl }) => {
  const [csvData, setCsvData] = useState<ParseResult<string[]>['data']>([]);
  const { previewLoading, setPreviewLoading } = useFileActions();
  const handleError = usePreviewError();

  // ignoring result.errors for now and just using result.data
  const handleReadComplete = useCallback(
    ({ data }) => {
      setCsvData(data);
      setPreviewLoading(false);
    },
    [setPreviewLoading]
  );

  useEffect(() => {
    setPreviewLoading(true);
    Papa.parse(downloadUrl, {
      complete: handleReadComplete,
      download: true,
      error: () => handleError('Could not read CSV'),
    });
  }, [downloadUrl, setPreviewLoading, handleReadComplete, handleError]);

  const hasParsed = csvData.length > 0;

  const columns = hasParsed
    ? csvData[0].reduce(
        (columns: Array<{ name: string; key: number }>, columnName, index) =>
          columns.concat({ name: columnName, key: index }),
        []
      )
    : [];
  const rows = hasParsed ? csvData.slice(1) : [];

  const html = (
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

  return previewLoading ? (
    <PreviewLoading />
  ) : !hasParsed ? null : (
    <Grid item>
      <SpreadsheetView data={[{ name: 'Sheet1', html }]} />
    </Grid>
  );
};
