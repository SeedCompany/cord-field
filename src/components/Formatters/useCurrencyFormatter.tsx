export const useCurrencyFormatter = (options?: Intl.NumberFormatOptions) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    ...options,
  });
  return (value: number) => formatter.format(value);
};
