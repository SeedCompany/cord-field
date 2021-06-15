import { makeVar, useReactiveVar } from '@apollo/client';

const currentChangesetVar = makeVar<string | null>(null);

export const useCurrentChangeset = () => {
  const current = useReactiveVar(currentChangesetVar);
  return [current, currentChangesetVar] as const;
};
