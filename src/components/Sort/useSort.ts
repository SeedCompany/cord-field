import { isEmpty } from 'lodash';
import { Order } from '~/api/schema';
import { Nullable } from '~/common';
import { makeQueryHandler, StringParam, withTransform } from '~/hooks';
import { SortValue } from './SortControl';

export const useSort = <T>(
  defaultSort?: keyof T,
  defaultOrder: Order = 'ASC'
) => {
  const [value, onChange] = useSortHandler();
  // Adapt output to have generic for sort value
  return {
    value:
      defaultSort && isEmpty(value.sort)
        ? { sort: defaultSort, order: defaultOrder }
        : value.sort,
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
