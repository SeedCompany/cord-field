import { possibleTypes as possibleTypeMap } from '../fragmentMatcher';
import type { GqlTypeMap } from '../typeMap.generated';

export const getIdArg = (args: Record<string, any> | null) => {
  const id = args?.id;
  if (!id) {
    // This will only happen if a policy is manually connected incorrectly somewhere.
    // This isn't referencing the operation variables either so there's no fear on
    // different ways the operations could be defined across the app.
    throw new Error(
      `This policy must be used on a field with an \`id\` argument.`
    );
  }
  return id;
};

export const getPossibleTypes = (typename: keyof GqlTypeMap) => [
  typename,
  ...((possibleTypeMap as Record<string, readonly string[]>)[typename] ?? []),
];
