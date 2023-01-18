import { useCallback, useMemo } from 'react';
import { Nullable } from '~/common';
import { useLocale } from '~/hooks';

export const useNumberFormatter = (options?: Intl.NumberFormatOptions) => {
  const locale = useLocale();
  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, options),
    [locale, options]
  );
  return useCallback(
    (value: Nullable<number>) => (value != null ? formatter.format(value) : ''),
    [formatter]
  );
};

export const FormattedNumber = ({ value }: { value: Nullable<number> }) => {
  const formatNumber = useNumberFormatter();
  return <>{formatNumber(value)}</>;
};
