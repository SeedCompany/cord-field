import { InMemoryCache, PossibleTypesMap, TypePolicies } from '@apollo/client';
import { possibleTypes } from '../schema/fragmentMatcher';
import { typePolicies } from '../schema/typePolicies';

export const createCache = () => {
  // @ts-expect-error since we use `as const` we need to convert the readonly arrays
  // of specific strings to arrays of any strings.
  const pt: PossibleTypesMap = possibleTypes;

  // Our "strict type" allows for partials. Due to a TS limitation, partials
  // could be missing keys or keys with a value of undefined. We are going
  // to assume that the values will never explicitly be undefined, but rather
  // just omitted.
  const tp = typePolicies as TypePolicies;

  const cache = new InMemoryCache({
    possibleTypes: pt,
    typePolicies: tp,
  });

  if (typeof window !== 'undefined') {
    const data = (window as any).__APOLLO_STATE__;
    cache.restore(data);
    if (process.env.NODE_ENV === 'production') {
      console.log('Initializing Apollo cache from server', data);
    }
  }

  return cache;
};
