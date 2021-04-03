import { FieldMergeFunction } from '@apollo/client/cache/inmemory/policies';
import type {
  FieldPolicy,
  FieldReadFunction,
  KeyFieldsFunction,
} from '@apollo/client/cache/inmemory/policies';
import type { Mutation, Query } from '../schema.generated';
import type { GqlTypeMap } from '../typeMap.generated';

type FieldPolicies<T> = {
  [K in keyof T]?: FieldPolicy<T[K]> | FieldReadFunction<T[K]>;
};

type KeySpecifier<K = string> = ReadonlyArray<K | readonly any[]>;

type GqlTypeMapAndQueries = GqlTypeMap & { Query: Query; Mutation: Mutation };

export interface TypePolicy<T> {
  keyFields?: KeySpecifier<keyof T> | KeyFieldsFunction | false;
  merge?: FieldMergeFunction<T> | boolean;
  queryType?: true;
  mutationType?: true;
  subscriptionType?: true;
  fields?: FieldPolicies<T>;
}

type TypePolicies = {
  [K in keyof GqlTypeMapAndQueries]?: TypePolicy<GqlTypeMapAndQueries[K]>;
};

const scriptureKeyFields = ['book', 'chapter', 'verse'] as const;

export const typePolicies: TypePolicies = {
  Language: {
    fields: {
      ethnologue: { merge: true },
    },
  },
  EthnologueLanguage: { keyFields: false },
  IanaCountry: { keyFields: ['code'] },
  TimeZone: { keyFields: ['name'] },
  IsoCountry: { keyFields: ['alpha3'] },
  ScriptureReference: {
    keyFields: scriptureKeyFields,
  },
  ScriptureRange: {
    keyFields: ['start', scriptureKeyFields, 'end', scriptureKeyFields],
  },
  Secured: {
    keyFields: false,
    merge: true,
  },
  FileNode: {
    fields: {
      parents: {
        merge: false,
      },
    },
  },
};
