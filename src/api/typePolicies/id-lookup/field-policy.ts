import type { FieldPolicy } from '@apollo/client/cache/inmemory/policies';
import type { GqlTypeMap } from '../../typeMap.generated';
import { getIdArg, getPossibleTypes } from '../util';

/**
 * This type policy tells Apollo that this query operation returns the type
 * (given) with the ID referenced.
 * This allows a network operation to be saved if we've already cached the object.
 * Note that Apollo also checks that all fields being asked for exist as well,
 * so this only helps if the complete object needed was fetched another way.
 */
export const redirectToTypeById = (
  typename: keyof GqlTypeMap
): FieldPolicy => ({
  read: (_, { args, toReference, readField }) => {
    const id = getIdArg(args);

    for (const possibleType of getPossibleTypes(typename)) {
      const ref = toReference({
        __typename: possibleType,
        id,
      });
      // This is only to save a lookup so if the id field cannot be read,
      // then the object is not cached and the redirect wouldn't save a network
      // request.
      if (ref && readField('id', ref)) {
        return ref;
      }
    }

    return undefined;
  },
});
