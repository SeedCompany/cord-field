import { Box } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import React, { FC, useCallback } from 'react';
import { usePreview } from './PreviewContext';

interface PreviewPaginationProps {
  pageCount: number;
}

export const PreviewPagination: FC<PreviewPaginationProps> = (props) => {
  const { children, pageCount } = props;
  const { previewPage, setPreviewPage } = usePreview();

  const handleChange = useCallback(
    (_, value) => {
      setPreviewPage(value);
    },
    [setPreviewPage]
  );

  return (
    <Box width="100%">
      <Box width="100%" display="flex" justifyContent="center">
        <Pagination
          count={pageCount}
          onChange={handleChange}
          page={previewPage}
          showFirstButton
          showLastButton
        />
      </Box>
      <Box width="100%">{children}</Box>
    </Box>
  );
};
