import { RadioGroup } from '@material-ui/core';
import { isString } from 'lodash';
import { ReactNode } from 'react';
import { Order } from '~/api/schema.graphql';

export interface SortValue<T> {
  sort: keyof T;
  order: Order;
}

export interface SortControlProps<T> {
  value: Partial<SortValue<T>>;
  onChange: (val: Partial<SortValue<T>>) => void;
  children: ReactNode;
}

export const SortControl = <T extends any>({
  value,
  onChange,
  children,
}: SortControlProps<T>) => (
  <RadioGroup
    aria-label="sort options"
    name="sort"
    value={value}
    onChange={(e) => {
      // ignore DOM event
      if (isString(e.target.value)) {
        return;
      }
      onChange(e.target.value);
    }}
  >
    {children}
  </RadioGroup>
);
