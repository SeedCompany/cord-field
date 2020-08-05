import { FieldMergeFunction } from '@apollo/client';

// This just merges the existing object with the incoming one
export const mergeObjects: FieldMergeFunction<object, object> = (
  existing,
  incoming
) => ({
  ...existing,
  ...incoming,
});
