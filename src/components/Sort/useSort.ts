import { useSearchParams } from 'react-router-dom';
import { Order } from '../../api';
import { SortValue } from './SortControl';

export const useSort = <T>() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value: Partial<SortValue<T>> = {
    sort: (searchParams.get('sort') as keyof T) ?? undefined,
    order: searchParams.get('order')?.toUpperCase() as Order,
  };
  const onChange = ({ sort, order }: Partial<SortValue<T>>) => {
    const next = new URLSearchParams(searchParams);
    sort ? next.set('sort', sort as string) : next.delete('sort');
    order ? next.set('order', order.toLowerCase()) : next.delete('order');
    setSearchParams(next, { replace: true });
  };
  return { value, onChange };
};
