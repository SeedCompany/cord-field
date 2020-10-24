import { ApolloCache } from '@apollo/client';
import { ReadFieldFunction } from '@apollo/client/cache/core/types/common';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

type ExtractFragmentReturn<Type> = Type extends DocumentNode<infer X>
  ? X
  : never;

interface UpdateListQueryItemsInput<
  FragmentDoc extends DocumentNode,
  Item extends ExtractFragmentReturn<FragmentDoc>
> {
  cache: ApolloCache<unknown>;
  existingItemRefs: any;
  fragment: FragmentDoc;
  newItem: Item;
  readField: ReadFieldFunction;
}

export const updateListQueryItems = <
  FragmentDoc extends DocumentNode,
  Item extends ExtractFragmentReturn<FragmentDoc>
>(
  input: UpdateListQueryItemsInput<FragmentDoc, Item>
) => {
  const { fragment, newItem, existingItemRefs, readField, cache } = input;
  const newItemRef = cache.writeFragment({
    data: newItem,
    fragment,
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
    items: [...existingItemRefs.items, newItemRef],
  };
};
