import { CircularProgress } from '@material-ui/core';
import React from 'react';
import { AuthContent } from './AuthContent';

export const AuthWaiting = () => (
  <AuthContent>
    <CircularProgress />
  </AuthContent>
);
