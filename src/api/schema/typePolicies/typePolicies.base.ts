import { FieldMergeFunction } from '@apollo/client/cache/inmemory/policies';
import type {
  FieldPolicy,
  FieldReadFunction,
  KeyFieldsFunction,
} from '@apollo/client/cache/inmemory/policies';
import type { Mutation, Query } from '../schema.graphql';
import type { GqlTypeMap } from '../typeMap';

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

export const typePolicies: TypePolicies = {
  DateRange: {
    keyFields: false,
    merge: true,
  },
  Language: {
    fields: {
      ethnologue: { merge: true },
    },
  },
  EthnologueLanguage: { keyFields: false },
  IanaCountry: { keyFields: ['code'] },
  TimeZone: { keyFields: ['name'] },
  IsoCountry: { keyFields: ['alpha3'] },
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
  ChangesetAware: {
    // Include changeset ID in ChangesetAware's key fields if it is given
    keyFields: (object: any) =>
      object?.changeset?.id ? ['id', 'changeset', ['id']] : ['id'],
  },
  ChangesetDiff: {
    merge: true,
  },
  ProductProgress: {
    keyFields: ['product', ['id'], 'report', ['id'], 'variant', ['key']],
  },
  LanguageEngagement: {
    fields: {
      partnershipsProducingMediums: {
        // Entire updated list is returned each time.
        merge: false,
      },
    },
  },
  ProgressReport: {
    fields: {
      varianceExplanation: {
        merge: true,
      },
    },
  },
};
