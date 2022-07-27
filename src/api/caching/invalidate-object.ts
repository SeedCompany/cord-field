import { ApolloCache, MutationUpdaterFunction } from '@apollo/client';
import { GqlObject } from '../schema';

/**
 * Remove the given object from cache. This causes it to be re-fetched from
 * network when needed.
 * It's a shortcut for cache.modify().
 */
export const invalidateObject = (
  cache: ApolloCache<unknown>,
  object: GqlObject
) => {
  // @ts-expect-error index signature blah blah. our input is stricter.
  const id = cache.identify(object);
  if (!id) {
    return;
  }

  cache.modify({
    id,
    fields: (_, { DELETE }) => DELETE,
  });
};

/**
 * A variant of {@link invalidateObject} that can be given directly to a
 * mutation's cache function.
 */
export const onUpdateInvalidateObject =
  <MutationOutput>(
    object: GqlObject
  ): MutationUpdaterFunction<
    MutationOutput,
    unknown,
    unknown,
    ApolloCache<unknown>
  > =>
  (cache) => {
    invalidateObject(cache, object);
  };
