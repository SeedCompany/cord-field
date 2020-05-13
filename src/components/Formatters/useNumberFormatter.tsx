export const useNumberFormatter = (options?: Intl.NumberFormatOptions) => {
  const formatter = new Intl.NumberFormat(undefined, options);
  return (value: number) => formatter.format(value);
};
