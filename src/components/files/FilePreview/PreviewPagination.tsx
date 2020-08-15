import { Grid } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { FC, useCallback, useEffect } from 'react';
import { useFileActions } from '../FileActions';

interface PreviewPaginationProps {
  pageCount: number;
}

export const PreviewPagination: FC<PreviewPaginationProps> = (props) => {
  const { children, pageCount } = props;
  const { previewPage, setPreviewPage } = useFileActions();

  useEffect(() => {
    return () => setPreviewPage(1);
  }, [setPreviewPage]);

  const handleChange = useCallback(
    (_, value) => {
      setPreviewPage(value);
    },
    [setPreviewPage]
  );

  return (
    <>
      <Grid item xs={12}>
        <Pagination
          count={pageCount}
          onChange={handleChange}
          page={previewPage}
          showFirstButton
          showLastButton
        />
      </Grid>
      <Grid item xs={12}>
        {children}
      </Grid>
    </>
  );
};
