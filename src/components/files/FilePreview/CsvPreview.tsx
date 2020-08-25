import Papa, { ParseResult } from 'papaparse';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { ColumnData, SpreadsheetView } from './SpreadsheetView';

export const CsvPreview: FC<PreviewerProps> = (props) => {
  const { file, previewLoading, setPreviewLoading, setPreviewError } = props;
  const [csvData, setCsvData] = useState<ParseResult<string[]>['data']>([]);

  // ignoring result.errors for now and just using result.data
  const handleReadComplete = useCallback(
    ({ data }) => {
      setCsvData(data);
      setPreviewLoading(false);
    },
    [setPreviewLoading]
  );

  useEffect(() => {
    if (file) {
      Papa.parse(file, {
        complete: handleReadComplete,
        download: true,
        error: () => setPreviewError('Could not read CSV'),
      });
    }
  }, [file, handleReadComplete, setPreviewError]);

  const hasParsed = csvData.length > 0;

  const columns = hasParsed
    ? csvData[0].reduce(
        (columns: ColumnData, columnName, index) =>
          columns.concat({ name: columnName, key: index }),
        []
      )
    : [];
  const rows = hasParsed
    ? csvData.slice(1).map((row) =>
        row.map((cell, index) => ({
          index,
          spanned: false,
          rowspan: 1,
          colspan: 1,
          content: cell,
        }))
      )
    : [];

  return previewLoading ? (
    <PreviewLoading />
  ) : !hasParsed ? null : (
    <SpreadsheetView data={[{ name: 'Sheet1', rows, columns }]} />
  );
};
