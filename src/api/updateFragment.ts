import { ApolloCache } from '@apollo/client';
import { Cache } from '@apollo/client/cache/core/types/Cache';
import { Reference, StoreObject } from '@apollo/client/utilities';
import { DeepPartial } from 'ts-essentials';
import { Entity } from './list-caching';

export interface UpdateFragmentOptions<
  FragmentType,
  TVariables,
  Partial extends boolean | undefined
> extends Cache.ReadFragmentOptions<FragmentType, TVariables> {
  object?: StoreObject | Reference | Entity;
  returnPartialData?: Partial;
  optimistic?: boolean;
  broadcast?: boolean;
  updater: (
    data: MaybePartial<FragmentType, Partial>
  ) => MaybePartial<FragmentType, Partial> | undefined | void;
}

type MaybePartial<T, Partial extends boolean | undefined> = Partial extends true
  ? DeepPartial<T>
  : T;

/**
 * Shortcut for reading & updating a fragment.
 *
 * updater function is called only if data is read from cache.
 * result of updater function, if not undefined, is written back to cache.
 *
 * `object` can be given instead of `id` which will automatically be identified
 * (if it can't the updater function will not be called).
 *
 * This is similar to cache.modify but since a fragment is specified cache data
 * is given back exactly like it is asked for, instead of raw normalized references.
 */
export const updateFragment = <
  FragmentType,
  TVariables,
  Partial extends boolean | undefined
>(
  cache: ApolloCache<unknown>,
  {
    object,
    id,
    updater,
    broadcast,
    ...options
  }: UpdateFragmentOptions<FragmentType, TVariables, Partial>
) => {
  if (object) {
    id = cache.identify(object as StoreObject);
    if (!id) {
      return;
    }
  }

  const data = cache.readFragment({
    ...options,
    id,
  });
  if (!data) {
    return;
  }

  // This typecast is to make the type more correct. If we've specified
  // returnPartialData then the result data is deeply partial.
  const next = updater(data as MaybePartial<FragmentType, Partial>);
  if (next === undefined) {
    return;
  }

  cache.writeFragment({
    ...options,
    id,
    data: next,
    broadcast,
  });
};
