import type {
  FieldFunctionOptions,
  FieldPolicy,
} from '@apollo/client/cache/inmemory/policies';
import { possibleTypes } from '../../fragmentMatcher';
import { GqlTypeMap } from '../../typeMap.generated';

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
  const id = args?.id;
  if (!id) {
    console.error(
      `Unable to remove ${typename} from cache, because the ID could not be found.
Change your mutation ID variable to be named \`id\`.
        `
    );
    return;
  }
  const storeId = [
    typename,
    ...((possibleTypes as Record<string, readonly string[]>)[typename] ?? []),
  ]
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
