import { ApolloCache } from '@apollo/client';
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

interface UpdateListQueryItemsInput<Type extends { id: string }> {
  cache: ApolloCache<unknown>;
  existingItemRefs: any;
  fragment: DocumentNode<Type, unknown>;
  fragmentName: string;
  newItem: Type | undefined;
  readField: ReadFieldFunction;
}

export const updateListQueryItems = <Type extends { id: string }>(
  input: UpdateListQueryItemsInput<Type>
) => {
  const {
    cache,
    existingItemRefs,
    fragment,
    fragmentName,
    newItem,
    readField,
  } = input;
  if (!newItem) return existingItemRefs;
  const newItemRef = cache.writeFragment({
    data: newItem,
    fragment,
    fragmentName,
  });
  if (
    existingItemRefs?.items.some(
      (ref: any) => readField('id', ref) === newItem.id
    )
  ) {
    return existingItemRefs;
  }
  return {
    ...existingItemRefs,
    total: Number(existingItemRefs.total) + 1,
    items: [newItemRef, ...existingItemRefs.items],
  };
};
