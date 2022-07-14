import { Box } from '@mui/material';
import { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import { Code } from '../Debug';

export const AddCurrentPath = (fn: () => ReactElement) => {
  const { pathname } = useLocation();
  return (
    <>
      {fn()}
      <Box mt={4} display="flex">
        <Code>Current path: {pathname}</Code>
      </Box>
    </>
  );
};
