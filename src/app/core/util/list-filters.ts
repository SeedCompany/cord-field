import { ifValueFn, Omit } from '@app/core/util/index';
import { DateTime } from 'luxon';

export const toIds = ifValueFn((items: Array<{ id: string }>) => items.map(item => item.id));

export interface DateFilter {
  dateRange?: 'createdAt' | 'updatedAt';
  startDate?: DateTime;
  endDate?: DateTime;
}

export interface DateFilterAPI {
  createdAt?: { gte?: DateTime, lte?: DateTime };
  updatedAt?: { gte?: DateTime, lte?: DateTime };
}

export const buildDateFilter = <Filters extends DateFilter>(filters: Filters): Omit<Filters, keyof DateFilter> & DateFilterAPI => {
  const { dateRange, startDate, endDate, ...rest } = filters;

  if (dateRange && (startDate || endDate)) {
    return {
      [dateRange]: {
        gte: startDate,
        lte: endDate,
      },
      ...rest,
    };
  }

  return rest;
};
