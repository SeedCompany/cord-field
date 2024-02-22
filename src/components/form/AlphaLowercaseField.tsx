import {
  FormattedTextField,
  FormattedTextFieldProps,
} from './FormattedTextField';
import { isLength } from './validators';

type AlphaFieldProps = FormattedTextFieldProps & {
  chars: number;
};

export const AlphaField = ({ chars, ...props }: AlphaFieldProps) => (
  <FormattedTextField
    accept={/[a-zA-Z]/g}
    formatInput={(value) =>
      (value.match(/[a-zA-Z]+/g) || []).join('').slice(0, chars)
    }
    validate={isLength(chars)}
    {...props}
  />
);

export const AlphaLowercaseField = (props: AlphaFieldProps) => (
  <AlphaField replace={(value) => value.toLowerCase()} {...props} />
);

export const AlphaUppercaseField = (props: AlphaFieldProps) => (
  <AlphaField replace={(value) => value.toUpperCase()} {...props} />
);
