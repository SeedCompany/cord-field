import React, { FC } from 'react';
import { Except } from 'type-fest';
import {
  FormattedTextField,
  FormattedTextFieldProps,
} from './FormattedTextField';
import {
  email as emailValidator,
  required as requiredValidator,
} from './validators';

export type EmailFieldProps = Except<
  FormattedTextFieldProps,
  'type' | 'name' | 'inputMode' | 'replace'
> & {
  name?: string;
  /** If true, input will not be lower-cased */
  caseSensitive?: boolean;
};

export const EmailField: FC<EmailFieldProps> = ({
  name = 'email',
  required = true,
  caseSensitive,
  ...rest
}) => (
  <FormattedTextField
    name={name}
    label="Email"
    placeholder="Enter Email Address"
    validate={[required ? requiredValidator : null, emailValidator]}
    required={required}
    {...rest}
    inputMode="email"
    replace={(v) => (caseSensitive ? v : v.toLowerCase())}
  />
);
