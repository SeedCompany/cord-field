import { useMemo } from 'react';
import { useNumberFormatter } from './useNumberFormatter';

export const useCurrencyFormatter = (options?: Intl.NumberFormatOptions) => {
  const currencyOptions = useMemo(
    () =>
      ({
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
        ...options,
      } satisfies Intl.NumberFormatOptions),
    [options]
  );
  return useNumberFormatter(currencyOptions);
};
