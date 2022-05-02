import { useContext, useMemo } from 'react';
import { RequestContext, useLocale } from '../../hooks';
import { Nullable } from '../../util';

export const useNumberFormatter = (options?: Intl.NumberFormatOptions) => {
  const req = useContext(RequestContext);
  const locale = useLocale();
  const formatter = useMemo(() => {
    try {
      return new Intl.NumberFormat(locale, options);
    } catch (e) {
      console.warn('Failed to create number formatter with locale', {
        locale,
        ua: req?.headers['user-agent'] ?? navigator.userAgent,
        ssr: typeof window === 'undefined',
      });
    }
    try {
      return new Intl.NumberFormat(undefined, options);
    } catch (e) {
      console.warn('Failed to create number formatter with default locale');
    }
    return {
      format: (value: number): string => `${value}`,
    };
  }, [req, locale, options]);
  return (value: Nullable<number>) =>
    value != null ? formatter.format(value) : '';
};
