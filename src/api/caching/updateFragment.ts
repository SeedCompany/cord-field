import {
  ApolloCache,
  MutationUpdaterFunction,
  StoreObject,
  Unmasked,
} from '@apollo/client';
import {
  getFragmentName,
  MaybePartial,
  readFragment,
  ReadFragmentOptions,
} from './readFragment';

export interface UpdateFragmentOptions<
  FragmentType,
  TVariables,
  Partial extends boolean | undefined = false
> extends ReadFragmentOptions<FragmentType, TVariables, Partial> {
  broadcast?: boolean;
  updater: (
    data: Unmasked<MaybePartial<FragmentType, Partial>>
  ) => Unmasked<MaybePartial<FragmentType, Partial>> | undefined | void;
}

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
 *
 * FYI Apollo Client v3.5 has its own updateFragment function, but it is not
 * as robust as this implementation.
 * This handles id & fragmentName options automatically, adjust data type to be
 * recursively partial when using returnPartialData option.
 */
export const updateFragment = <
  FragmentType,
  TVariables,
  Partial extends boolean | undefined = false
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

  const data = readFragment(cache, {
    ...options,
    id,
  });
  if (!data) {
    return;
  }

  const next = updater(data);
  if (next === undefined) {
    return;
  }

  cache.writeFragment<MaybePartial<FragmentType, Partial>, TVariables>({
    ...options,
    id,
    fragmentName: getFragmentName(options),
    data: next,
    broadcast,
  });
};

/**
 * A variant of {@link updateFragment} that can be given directly to a
 * mutation's cache function.
 */
export const onUpdateChangeFragment =
  <
    MutationOutput,
    FragmentType,
    TVariables,
    Partial extends boolean | undefined = false
  >(
    options: UpdateFragmentOptions<FragmentType, TVariables, Partial>
  ): MutationUpdaterFunction<
    MutationOutput,
    TVariables,
    unknown,
    ApolloCache<unknown>
  > =>
  (cache) => {
    updateFragment(cache, options);
  };
