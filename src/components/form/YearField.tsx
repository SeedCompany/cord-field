import { NumberField, NumberFieldProps } from './NumberField';
import { max, min } from './validators';

export type YearFieldProps = NumberFieldProps;

export const YearField = (props: YearFieldProps) => (
  <NumberField
    validate={[
      min(1900, 'Year is too far in the past'),
      max(2100, 'Year is too far in the future'),
    ]}
    {...props}
    accept={/[\d]/g}
    formatInput={formatInput}
    mask
  />
);

const formatInput = (string: string) => {
  if (!string) {
    return '';
  }
  const accepted = (string.match(/[\d]+/g) || []).join('');
  return accepted.slice(0, 4);
};
