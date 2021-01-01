import { Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { Route } from 'react-router-dom';
import { StatusCode } from '../Routing';
import { Error } from './Error';

export const NotFoundPage: FC = ({ children }) => (
  <Error show page>
    <StatusCode code={404} />
    {!children || typeof children === 'string' ? (
      <Typography variant="h2">{children ?? 'Page Not Found'}</Typography>
    ) : (
      children
    )}
  </Error>
);

export const NotFoundRoute = <Route path="*" element={<NotFoundPage />} />;
