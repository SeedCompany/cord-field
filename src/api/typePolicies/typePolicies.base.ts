import type {
  FieldPolicy,
  FieldReadFunction,
  KeyFieldsFunction,
} from '@apollo/client/cache/inmemory/policies';
import type { GqlTypeMap } from '../typeMap.generated';

type FieldPolicies<T> = {
  [K in keyof T]?: FieldPolicy<T[K]> | FieldReadFunction<T[K]>;
};

type KeySpecifier<K = string> = ReadonlyArray<K | readonly any[]>;

export interface TypePolicy<T> {
  keyFields?: KeySpecifier<keyof T> | KeyFieldsFunction | false;
  queryType?: true;
  mutationType?: true;
  subscriptionType?: true;
  fields?: FieldPolicies<T>;
}

type TypePolicies = {
  [K in keyof GqlTypeMap]?: TypePolicy<GqlTypeMap[K]>;
};

export const typePolicies: TypePolicies = {};
