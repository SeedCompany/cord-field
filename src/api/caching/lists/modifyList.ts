import { ApolloCache, isReference, TypePolicies } from '@apollo/client';
import type { Reference } from '@apollo/client';
import { Modifier, Modifiers } from '@apollo/client/cache/core/types/common';
import type { EntityStore } from '@apollo/client/cache/inmemory/entityStore';
import { mapValues, Nil } from '@seedcompany/common';
import type { ConditionalKeys } from 'type-fest';
import type { Entity, GqlTypeOf } from '../../schema';
import type { Query } from '../../schema/schema.graphql';
import { typePolicies } from '../../schema/typePolicies';
import { PaginatedListOutput, SortableListInput } from './types';

// Only the keys of T that represent list fields.
type ListFieldKeys<T> = ConditionalKeys<T, PaginatedListOutput<any> | Nil>;

type ObjectWithField<Obj extends Entity> =
  | [existingObject: Obj | Nil, field: ListFieldKeys<GqlTypeOf<Obj>>]
  | [ref: Reference, field: string];

export type ListIdentifier<OwningObj extends Entity> =
  | ListFieldKeys<Query>
  | ObjectWithField<OwningObj>;

export type ListModifier = Modifier<PaginatedListOutput<Reference> | Nil>;

export interface ModifyListOptions<OwningObj extends Entity, Args> {
  cache: ApolloCache<unknown>;
  // Which list to add to.
  // This can be the name of a root level query that returns a list
  // or a tuple of an object and the name of its list field.
  listId: ListIdentifier<OwningObj>;
  // Filter which list variations to apply to (by default it's all)
  filter?: (args: Args) => boolean;
  modifier: ListModifier;
}

export const modifyList = <OwningObj extends Entity, Args>({
  cache,
  listId,
  modifier,
  filter,
}: ModifyListOptions<OwningObj, Args>) => {
  const [id, field] = identifyList(cache, listId);
  if (!field) {
    return;
  }

  // @ts-expect-error assuming in memory cache with entity store
  const store: EntityStore | null = cache.data;
  const obj = store?.toObject()[id ?? 'ROOT_QUERY'] ?? {};
  const listVariations = Object.keys(obj)
    .filter(
      (query) =>
        query === field ||
        query.startsWith(`${field}(`) ||
        query.startsWith(`${field}:`)
    )
    .filter((storeName) => {
      if (!filter) {
        return true;
      }
      try {
        return filter(argsFromStoreFieldName<Args>(storeName));
      } catch (e) {
        console.error(
          `List variation filter failed for "${
            !id ? `Query.${field}` : `${id}.${field}`
          }"\n`,
          e
        );
        return false;
      }
    });

  const fields = mapValues.fromList(listVariations, () => modifier).asRecord;
  cache.modify({
    ...(id ? { id } : {}),
    fields: fields as Modifiers<OwningObj>,
  });
};

export const identifyList = <OwningObj extends Entity>(
  cache: ApolloCache<unknown>,
  listId: ListIdentifier<OwningObj>
): readonly [
  objectId: string | undefined,
  fieldOrQueryName: string | undefined
] => {
  if (Array.isArray(listId)) {
    if (!listId[0]) {
      // We allow existing object to be null to help with types. It's common for the
      // object to be null while it's being loaded. But we expect it to be there
      // at the time the mutation is invoked. Confirm this assumption here.
      console.error(
        'Trying to modify list field on object but object was null'
      );
      return [undefined, undefined];
    }
    // @ts-expect-error TS doesn't like that Entity doesn't have an index signature.
    // That doesn't matter for this as it would only be widening the type.
    return [cache.identify(listId[0]), listId[1] as string];
  }
  return [undefined, listId];
};

export const defaultSortingForList = <OwningObj extends Entity>(
  listId: ListIdentifier<OwningObj>
) => {
  const [type, field] = Array.isArray(listId)
    ? [
        isReference(listId[0])
          ? listId[0].__ref.slice(0, listId[0].__ref.indexOf(':'))
          : // @ts-expect-error typename does exist on all of these objects.
            // we need to change type gen to show that.
            (listId[0].__typename as string),
        listId[1] as string,
      ]
    : ['Query', listId as string];
  const fieldPolicy = (typePolicies as TypePolicies)[type]?.fields?.[field];
  return (fieldPolicy as { defaultSort?: SortableListInput }).defaultSort;
};

export const argsFromStoreFieldName = <T>(storeFieldName: string): T => {
  const argsStr = /{.*}/.exec(storeFieldName)?.[0];
  const args = argsStr ? JSON.parse(argsStr) : {};
  return args;
};
