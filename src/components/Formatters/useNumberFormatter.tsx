import { Nullable } from '../../util';

export const useNumberFormatter = (options?: Intl.NumberFormatOptions) => {
  const formatter = new Intl.NumberFormat(undefined, options);
  return (value: Nullable<number>) =>
    value != null ? formatter.format(value) : '';
};
