import type {
  FieldFunctionOptions,
  FieldPolicy,
} from '@apollo/client/cache/inmemory/policies';
import { GqlTypeMap } from '../../typeMap.generated';
import { getIdArg, getPossibleTypes } from '../util';

export const handleDelete = (typename: keyof GqlTypeMap): FieldPolicy => ({
  merge: (existing, incoming, options) => {
    removeItem(typename, options);
    return options.mergeObjects(existing, incoming);
  },
});

const removeItem = (
  typename: keyof GqlTypeMap,
  { args, cache, ...opts }: FieldFunctionOptions
) => {
  const id = getIdArg(args);
  if (args?.changeset) {
    // Objects deleted in changesets are still around so don't remove them.
    return;
  }

  const storeId = getPossibleTypes(typename)
    .map((name) => cache.identify({ __typename: name, id }))
    .find(
      (maybeId) => maybeId && opts.readField('id', opts.toReference(maybeId))
    );
  if (!storeId) {
    console.warn(
      `Could not find ${typename} with ID "${id}" in cache. This is probably something wrong.`
    );
  }

  // Allow mutation updaters to run first as they might need to read the object in cache
  setTimeout(() => {
    console.log(`Removing ${storeId} from cache`);
    cache.evict({ id: storeId });
    cache.gc();
  });
};
