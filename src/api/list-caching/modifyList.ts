import { ApolloCache } from '@apollo/client';
import type { Reference } from '@apollo/client';
import { Modifier } from '@apollo/client/cache/core/types/common';
import { StoreObject } from '@apollo/client/utilities';
import type { ConditionalKeys } from 'type-fest';
import { keys, mapFromList, Nullable } from '../../util';
import type { Query } from '../schema.generated';
import { PaginatedListOutput } from './types';

// Only the keys of T that represent list fields.
type ListFieldKeys<T> = ConditionalKeys<T, Nullable<PaginatedListOutput<any>>>;

type ObjectWithField<Obj extends StoreObject> =
  | [existingObject: Obj, field: ListFieldKeys<Obj>]
  | [ref: Reference, field: string];

export type ListIdentifier<OwningObj extends { id: string }> =
  | ListFieldKeys<Query>
  | ObjectWithField<OwningObj>;

export type ListModifier = Modifier<Nullable<PaginatedListOutput<Reference>>>;

export interface ModifyListOptions<OwningObj extends { id: string }, Args> {
  cache: ApolloCache<unknown>;
  // Which list to add to.
  // This can be the name of a root level query that returns a list
  // or a tuple of an object and the name of its list field.
  listId: ListIdentifier<OwningObj>;
  // Filter which list variations to apply to (by default it's all)
  filter?: (args: Args) => boolean;
  modifier: ListModifier;
}

export const modifyList = <OwningObj extends { id: string }, Args>({
  cache,
  listId,
  modifier,
  filter,
}: ModifyListOptions<OwningObj, Args>) => {
  const [id, field] = Array.isArray(listId)
    ? [cache.identify(listId[0]), listId[1]]
    : [undefined, listId];

  // @ts-expect-error assuming in memory cache with internal data map
  const obj = cache.data?.data[id ?? 'ROOT_QUERY'] ?? {};
  const listVariations = keys(obj)
    .filter(
      (query) => query.startsWith(`${field}(`) || query.startsWith(`${field}:`)
    )
    .filter((storeName) =>
      filter ? filter(argsFromStoreFieldName<Args>(storeName)) : true
    );

  const fields = mapFromList(listVariations, (field) => [field, modifier]);
  cache.modify({
    ...(id ? { id } : {}),
    fields,
  });
};

export const argsFromStoreFieldName = <T>(storeFieldName: string): T => {
  const argsStr = /{.*}/.exec(storeFieldName)?.[0];
  const args = argsStr ? JSON.parse(argsStr) : {};
  return args;
};
