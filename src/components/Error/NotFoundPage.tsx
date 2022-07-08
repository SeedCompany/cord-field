import { Typography } from '@material-ui/core';
import React from 'react';
import { Route } from 'react-router-dom';
import { ChildrenProp } from '~/common';
import { StatusCode } from '../Routing';
import { Error } from './Error';

export const NotFoundPage = ({ children }: ChildrenProp) => (
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
