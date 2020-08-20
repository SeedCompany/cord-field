import { Grid } from '@material-ui/core';
import Papa, { ParseResult } from 'papaparse';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useFileActions, usePreviewError } from '../FileActions';
import { PreviewerProps } from './FilePreview';
import { PreviewLoading } from './PreviewLoading';
import { ColumnData, SpreadsheetView } from './SpreadsheetView';

export const CsvPreview: FC<PreviewerProps> = ({ file }) => {
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
    if (file) {
      Papa.parse(file, {
        complete: handleReadComplete,
        download: true,
        error: () => handleError('Could not read CSV'),
      });
    }
  }, [file, handleReadComplete, handleError]);

  const hasParsed = csvData.length > 0;

  const columns = hasParsed
    ? csvData[0].reduce(
        (columns: ColumnData, columnName, index) =>
          columns.concat({ name: columnName, key: index }),
        []
      )
    : [];
  const rows = hasParsed ? csvData.slice(1) : [];

  return previewLoading ? (
    <PreviewLoading />
  ) : !hasParsed ? null : (
    <Grid item>
      <SpreadsheetView data={[{ name: 'Sheet1', rows, columns }]} />
    </Grid>
  );
};
