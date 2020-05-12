import { Box } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { useLocation } from 'react-router';

export const AddCurrentPath = (fn: () => ReactElement) => {
  // render fn with provider's context
  const Fn = () => {
    const { pathname } = useLocation();
    return (
      <>
        {fn()}
        <Box component="pre" mt={4}>
          Current path: {pathname}
        </Box>
      </>
    );
  };
  return <Fn />;
};
