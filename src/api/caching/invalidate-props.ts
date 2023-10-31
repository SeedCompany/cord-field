import { ApolloCache, MutationUpdaterFunction } from '@apollo/client';
import { Modifier } from '@apollo/client/cache';
import { isNotFalsy, Many, mapValues, Nil } from '@seedcompany/common';
import { GqlObject, GqlTypeOf } from '../schema';

type PropKeys<OwningObj extends GqlObject> = ReadonlyArray<
  Many<(keyof GqlTypeOf<OwningObj> & string) | Nil>
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
    fields: mapValues.fromList(
      fields.flat().filter(isNotFalsy),
      () => deleteField
    ).asRecord,
  });
};

const deleteField: Modifier<any> = (_, { DELETE }) => DELETE;

/**
 * A variant of {@link invalidateProps} that can be given directly to a
 * mutation's cache function.
 */
export const onUpdateInvalidateProps =
  <MutationOutput, OwningObj extends GqlObject>(
    object: OwningObj,
    ...fields: PropKeys<OwningObj>
  ): MutationUpdaterFunction<
    MutationOutput,
    unknown,
    unknown,
    ApolloCache<unknown>
  > =>
  (cache) => {
    invalidateProps(cache, object, ...fields);
  };
