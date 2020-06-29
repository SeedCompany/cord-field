import React, { FC } from 'react';
import { Except } from 'type-fest';
import {
  FormattedTextField,
  FormattedTextFieldProps,
} from './FormattedTextField';

export type VerseFieldProps = Except<
  FormattedTextFieldProps,
  'type' | 'name' | 'inputMode' | 'replace'
> & {
  name?: string;
};

export const VerseField: FC<VerseFieldProps> = ({
  name = 'verse',
  required = true,
  ...rest
}) => (
  <FormattedTextField
    name={name}
    label="Verse"
    placeholder="Enter Verse"
    // validate={[required ? validators.required : null, validators.email]}
    required={required}
    {...rest}
    inputMode="text"
  />
);
