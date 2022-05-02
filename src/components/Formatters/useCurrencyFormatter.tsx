import { useNumberFormatter } from './useNumberFormatter';

export const useCurrencyFormatter = (options?: Intl.NumberFormatOptions) =>
  useNumberFormatter({
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    ...options,
  });
