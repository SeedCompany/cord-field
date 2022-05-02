import { useMemo } from 'react';
import { useLocale } from '../../hooks';
import { Nullable } from '../../util';

export const useNumberFormatter = (options?: Intl.NumberFormatOptions) => {
  const locale = useLocale();
  const formatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, options);
    } catch (e) {
      console.warn('Failed to create number formatter with locale', locale);
    }
    try {
      return new Intl.NumberFormat(undefined, options);
    } catch (e) {
      console.warn('Failed to create number formatter with default locale');
    }
    return {
      format: (value: number): string => `${value}`,
    };
  }, [locale, options]);
  return (value: Nullable<number>) =>
    value != null ? formatter.format(value) : '';
};
