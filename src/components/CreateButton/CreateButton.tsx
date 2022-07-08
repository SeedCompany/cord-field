import React from 'react';
import { ErrorButton, ErrorButtonProps } from '../ErrorButton';

export type CreateButtonProps = ErrorButtonProps;

export const CreateButton = (props: CreateButtonProps) => (
  <ErrorButton variant="contained" {...props} />
);
