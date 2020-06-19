import { decodeString, encodeString } from 'serialize-query-params';
import { makeQueryHandler, StringParam } from '../../hooks';
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
  order: {
    decode: (val) => decodeString(val)?.toUpperCase(),
    encode: (val) => encodeString(val)?.toLowerCase(),
  },
});
