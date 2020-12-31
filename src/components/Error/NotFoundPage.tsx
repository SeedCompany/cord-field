import { Typography } from '@material-ui/core';
import React from 'react';
import { StatusCode } from '../Routing';
import { Error } from './Error';

export const NotFoundPage = () => (
  <Error show page>
    <StatusCode code={404} />
    <Typography variant="h2">Page Not Found</Typography>
  </Error>
);
