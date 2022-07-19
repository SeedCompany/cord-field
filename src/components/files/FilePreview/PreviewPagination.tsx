import { Grid } from '@material-ui/core';
import { Pagination, PaginationProps } from '@material-ui/lab';
import { useEffect } from 'react';
import { ChildrenProp } from '~/common';
import { useFileActions } from '../FileActions';

interface PreviewPaginationProps extends ChildrenProp {
  pageCount: number;
}

export const PreviewPagination = (props: PreviewPaginationProps) => {
  const { children, pageCount } = props;
  const { previewPage, setPreviewPage } = useFileActions();

  useEffect(() => {
    return () => setPreviewPage(1);
  }, [setPreviewPage]);

  const handleChange: PaginationProps['onChange'] = (_, value) => {
    setPreviewPage(value);
  };

  return (
    <Grid container direction="column" spacing={2} alignItems="center">
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
    </Grid>
  );
};
