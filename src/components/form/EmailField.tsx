import React, { FC } from 'react';
import { Except } from 'type-fest';
import { validators } from './index';
import { TextField, TextFieldProps } from './TextField';

export type EmailFieldProps = Except<TextFieldProps, 'type' | 'name'> & {
  name?: string;
};
export const EmailField: FC<EmailFieldProps> = ({
  name = 'email',
  required = true,
  ...rest
}) => (
  <TextField
    name={name}
    label="Email"
    placeholder="Enter Email Address"
    validate={[required ? validators.required : null, validators.email]}
    required={required}
    {...rest}
    type="email"
  />
);
