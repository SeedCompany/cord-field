import React, { FC } from 'react';
import { ErrorButton, ErrorButtonProps } from '../ErrorButton';

export type CreateButtonProps = ErrorButtonProps;

export const CreateButton: FC<CreateButtonProps> = (props) => (
  <ErrorButton variant="contained" {...props} />
);
