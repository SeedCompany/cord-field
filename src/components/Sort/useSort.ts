import { Order } from '../../api';
import { makeQueryHandler, StringParam, withTransform } from '../../hooks';
import { Nullable } from '../../util';
import { SortValue } from './SortControl';

export const useSort = <T>() => {
  const [value, onChange] = useSortHandler();
  // Adapt output to have generic for sort value
  return {
    value: value.sort,
    onChange: (next: Partial<SortValue<T>>) => {
      onChange({
        sort: next as SortValue<Record<string, any>>,
      });
    },
  };
};

const useSortHandler = makeQueryHandler({
  sort: withTransform<
    Partial<SortValue<Record<string, any>>>,
    Nullable<string>
  >(StringParam, {
    encode: (value, encoder) =>
      encoder(
        value.sort ? (value.order === 'DESC' ? '-' : '') + value.sort : null
      ),
    decode: (raw, decoder) => {
      const value = decoder(raw);
      if (!value) {
        return {};
      }
      const order: Order = value.startsWith('-') ? 'DESC' : 'ASC';
      const sort = value.startsWith('-') ? value.slice(1) : value;
      return { sort, order };
    },
  }),
});
