import { useMemo } from 'react';
import { useLocale } from '../../hooks';
import { Nullable } from '../../util';

export const useNumberFormatter = (options?: Intl.NumberFormatOptions) => {
  const locale = useLocale();
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, options),
    [locale, options]
  );
  return (value: Nullable<number>) =>
    value != null ? formatter.format(value) : '';
};
