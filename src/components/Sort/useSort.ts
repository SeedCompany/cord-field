import { makeQueryHandler, StringParam, withTransform } from '../../hooks';
import { SortValue } from './SortControl';

export const useSort = <T>() => {
  const [value, onChange] = useSortHandler();
  // Adapt output to have generic for sort value
  return {
    value: value as Partial<SortValue<T>>,
    onChange: onChange as (next: Partial<SortValue<T>>) => void,
  };
};

const useSortHandler = makeQueryHandler({
  sort: StringParam,
  order: withTransform(StringParam, {
    encode: (val, encoder) => encoder(val?.toLowerCase()),
    decode: (val, decoder) => decoder(val)?.toUpperCase(),
  }),
});
