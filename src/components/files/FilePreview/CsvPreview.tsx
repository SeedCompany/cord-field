import Papa, { ParseResult } from 'papaparse';
import React, { useCallback, useEffect, useState } from 'react';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import {
  ColumnData,
  jsonToTableRows,
  SpreadsheetView,
} from './SpreadsheetView';

export const CsvPreview = (props: PreviewerProps) => {
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
    ? csvData[0]!.reduce(
        (columns: ColumnData, columnName, index) =>
          columns.concat({ name: columnName, key: index }),
        []
      )
    : [];
  const rows = hasParsed ? jsonToTableRows(csvData.slice(1)) : [];

  return previewLoading ? (
    <PreviewLoading />
  ) : !hasParsed ? null : (
    <SpreadsheetView data={[{ name: 'Sheet1', rows, columns }]} />
  );
};

// eslint-disable-next-line import/no-default-export
export default CsvPreview;
