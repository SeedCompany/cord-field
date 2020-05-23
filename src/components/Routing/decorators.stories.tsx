import { Box } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { useLocation } from 'react-router';
import { Code } from '../Debug';

export const AddCurrentPath = (fn: () => ReactElement) => {
  // render fn with provider's context
  const Fn = () => {
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
  return <Fn />;
};
