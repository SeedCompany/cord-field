import { ApolloCache } from '@apollo/client';
import { MutationUpdaterFn } from '@apollo/client/core';
import { compact, Many } from 'lodash';
import { mapFromList, Nullable } from '../util';
import { GqlObject, GqlTypeOf } from './list-caching';

type PropKeys<OwningObj extends GqlObject> = ReadonlyArray<
  Many<Nullable<keyof GqlTypeOf<OwningObj> & string>>
>;

/**
 * Remove the given props from an the cached object. This causes them to be
 * re-fetched from network when needed.
 * It's a shortcut for cache.modify() and has strict typing for object's field keys
 * based on our schema.
 *
 * Any fields that are nil will be skipped. This is useful for conditional logic.
 */
export const invalidateProps = <OwningObj extends GqlObject>(
  cache: ApolloCache<unknown>,
  object: OwningObj,
  ...fields: PropKeys<OwningObj>
) => {
  // @ts-expect-error index signature blah blah. our input is stricter.
  const id = cache.identify(object);
  if (!id) {
    return;
  }

  cache.modify({
    id,
    fields: mapFromList(compact(fields.flat()), (field) => [
      field,
      (_, { DELETE }) => DELETE,
    ]),
  });
};

/**
 * A variant of {@link invalidateProps} that can be given directly to a
 * mutation's cache function.
 */
export const onUpdateInvalidateProps =
  <MutationOutput, OwningObj extends GqlObject>(
    object: OwningObj,
    ...fields: PropKeys<OwningObj>
  ): MutationUpdaterFn<MutationOutput> =>
  (cache) => {
    invalidateProps(cache, object, ...fields);
  };
