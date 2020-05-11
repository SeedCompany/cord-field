import React, { ReactElement } from 'react';
import { useLocation } from 'react-router';

export const AddCurrentPath = (fn: () => ReactElement) => {
  // render fn with provider's context
  const Fn = () => {
    const { pathname } = useLocation();
    return (
      <>
        {fn()}
        <pre>Current path: {pathname}</pre>
      </>
    );
  };
  return <Fn />;
};
