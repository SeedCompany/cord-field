import { Order } from '../schema.generated';
import { GqlTypeMap } from '../typeMap.generated';

export interface Entity {
  __typename?: keyof GqlTypeMap;
  id: string;
}

// With an actual type from an operation, convert it to a schema type
export type GqlTypeOf<T extends Entity> = GqlTypeMap[NonNullable<
  T['__typename']
>];

export interface InputArg<T> {
  input?: T | null;
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
