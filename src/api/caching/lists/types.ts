import { Order } from '../../schema.graphql';

export interface InputArg<T> {
  input?: T | null;
}

export interface FilterableListInput {
  filter?: Record<string, any>;
}
export interface SortableListInput {
  sort?: string;
  order?: Order;
}

export interface PaginatedListInput {
  count?: number | null;
  page?: number | null;
}

export interface PaginatedListOutput<T> {
  hasMore: boolean;
  items: readonly T[];
  total: number;
  nextPage?: number;
}
