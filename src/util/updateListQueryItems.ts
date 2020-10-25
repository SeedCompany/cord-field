import { ApolloCache } from '@apollo/client';
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

type ExtractFragmentReturn<Type> = Type extends DocumentNode<infer X>
  ? X
  : never;

interface UpdateListQueryItemsInput<
  FragmentDoc extends DocumentNode,
  Item extends ExtractFragmentReturn<FragmentDoc> | undefined
> {
  cache: ApolloCache<unknown>;
  existingItemRefs: any;
  fragment: FragmentDoc;
  fragmentName: string;
  newItem: Item;
  readField: ReadFieldFunction;
}

export const updateListQueryItems = <
  FragmentDoc extends DocumentNode,
  Item extends ExtractFragmentReturn<FragmentDoc> | undefined
>(
  input: UpdateListQueryItemsInput<FragmentDoc, Item>
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
