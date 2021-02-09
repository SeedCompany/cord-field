import React from 'react';
import { Except } from 'type-fest';
import {
  FormattedTextField,
  FormattedTextFieldProps,
} from './FormattedTextField';
import { isLength } from './validators';

interface AlphaLowercaseFieldProps
  extends Except<
    FormattedTextFieldProps,
    'accept' | 'formatInput' | 'replace' | 'validate'
  > {
  chars: number;
}

// A lower-cased alpha string field
export const AlphaLowercaseField = ({
  chars,
  ...props
}: AlphaLowercaseFieldProps) => (
  <FormattedTextField
    accept={/[a-zA-Z]/g}
    formatInput={(value) =>
      (value.match(/[a-zA-Z]+/g) || []).join('').substr(0, chars)
    }
    replace={(value) => value.toLowerCase()}
    validate={isLength(chars)}
    {...props}
  />
);
