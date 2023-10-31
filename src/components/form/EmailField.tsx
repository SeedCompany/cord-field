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

export const EmailField = ({
  name = 'email',
  required = true,
  caseSensitive,
  ...rest
}: EmailFieldProps) => (
  <FormattedTextField
    name={name}
    label="Email"
    placeholder="Enter Email Address"
    validate={[required ? requiredValidator : null, emailValidator]}
    required={required}
    {...rest}
    inputMode="email"
    parse={(v) => v || null}
    replace={(v) => (caseSensitive ? v : v.toLowerCase())}
  />
);
