import type { Reference } from '@apollo/client';
import type { MutationUpdaterFn } from '@apollo/client/core';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import type { DefinitionNode, ExecutableDefinitionNode } from 'graphql';
import type { ConditionalKeys } from 'type-fest';
import type { Query } from '../api';
import type { Nullable } from './types';

interface PaginatedList<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly hasMore: boolean;
}

export const addItemToList = <Type extends { id: string }, MutationOutput>(
  listQueryName: ConditionalKeys<Query, PaginatedList<any>>,
  fragment: DocumentNode<Type, unknown>,
  outputToItem: (out: MutationOutput) => Type
): MutationUpdaterFn<MutationOutput> => (cache, { data }) => {
  cache.modify({
    fields: {
      [listQueryName](
        existingItemRefs: Nullable<PaginatedList<Reference>>,
        { readField }
      ): Nullable<PaginatedList<Reference>> {
        if (!data) return existingItemRefs;

        const newItem = outputToItem(data);

        const newItemRef = cache.writeFragment({
          data: newItem,
          fragment,
          // writeFragment wants the fragment name to use when the doc has
          // multiple. We can safely assume these are all sub-fragments being
          // referenced, and the first one is the one we want.
          fragmentName: getFirstExecutableName(fragment),
        });

        if (
          !newItemRef ||
          !existingItemRefs ||
          existingItemRefs.items.some(
            (ref) => readField('id', ref) === newItem.id
          )
        ) {
          return existingItemRefs;
        }

        return {
          ...existingItemRefs,
          total: Number(existingItemRefs.total) + 1,
          items: [newItemRef, ...existingItemRefs.items],
        };
      },
    },
  });
};

const getFirstExecutableName = (document: DocumentNode<unknown, unknown>) => {
  const firstDef = document.definitions.find(isExecutableDef);
  return firstDef?.name?.value;
};

const isExecutableDef = (
  def: DefinitionNode
): def is ExecutableDefinitionNode =>
  def.kind === 'OperationDefinition' || def.kind === 'FragmentDefinition';
