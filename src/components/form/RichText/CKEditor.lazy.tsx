import loadable from '@loadable/component';
import { CircularProgress, OutlinedInput } from '@material-ui/core';
import * as React from 'react';

export const CKEditor = loadable(
  () => import(/* webpackChunkName: "CKEditor" */ './CKEditor'),
  {
    ssr: false,
    fallback: (
      <OutlinedInput disabled endAdornment={<CircularProgress size={20} />} />
    ),
  }
);
