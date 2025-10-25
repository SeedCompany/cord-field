import { ApolloCache, Unmasked } from '@apollo/client';
import { Cache } from '@apollo/client/cache/core/types/Cache';
import { Reference, StoreObject } from '@apollo/client/utilities';
import { ASTNode, FragmentDefinitionNode, Kind } from 'graphql';
import { DeepPartial } from 'ts-essentials';
import { Entity } from '../schema';

export interface ReadFragmentOptions<
  FragmentType,
  TVariables,
  Partial extends boolean | undefined = false
> extends Cache.ReadFragmentOptions<FragmentType, TVariables> {
  object?: StoreObject | Reference | Entity | null;
  returnPartialData?: Partial;
}

export type MaybePartial<
  T,
  Partial extends boolean | undefined
> = Partial extends true ? DeepPartial<T> : T;

/**
 * Small wrapper around ApolloCache.readFragment.
 *
 * - `object` can be given instead of `id` which will automatically be identified
 * - If `fragmentName` is not given the first in document will be picked
 * - If `returnPartialData` is true then the return type is deeply partial
 */
export const readFragment = <
  FragmentType,
  TVariables,
  Partial extends boolean | undefined = false
>(
  cache: ApolloCache<unknown>,
  {
    object,
    id,
    ...options
  }: ReadFragmentOptions<FragmentType, TVariables, Partial>
): Unmasked<MaybePartial<FragmentType, Partial>> | null => {
  if (object) {
    id = cache.identify(object as StoreObject);
    if (!id) {
      return null;
    }
  }

  const data = cache.readFragment({
    ...options,
    id,
    fragmentName: getFragmentName(options),
  });
  if (!data) {
    return null;
  }

  return data as any;
};

export const getFragmentName = (
  options: Cache.ReadFragmentOptions<unknown, unknown>
) =>
  options.fragmentName ??
  // With our GraphQL gen process each fragment defined gets its own document generated.
  // In that doc is the fragment being declared is first, and then any inner fragments
  // referenced are flatly concatenated at the below that. Thus, Apollo maybe cannot
  // assume which fragment to use, but we can always assume it is the first one.
  options.fragment.definitions.find(isFragmentDefinition)?.name.value;

export const isFragmentDefinition = (
  node: ASTNode
): node is FragmentDefinitionNode => node.kind === Kind.FRAGMENT_DEFINITION;
