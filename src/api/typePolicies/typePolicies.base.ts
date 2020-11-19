import type {
  FieldFunctionOptions,
  FieldPolicy,
  FieldReadFunction,
  KeyFieldsFunction,
} from '@apollo/client/cache/inmemory/policies';
import type { GqlTypeMap } from '../typeMap.generated';
import type { ProjectListInput, Query } from '..';

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

type GqlTypeMapAndQueries = GqlTypeMap & { Query: Query };

type TypePolicies = {
  [K in keyof GqlTypeMapAndQueries]?: TypePolicy<GqlTypeMapAndQueries[K]>;
};

const scriptureKeyFields = ['book', 'chapter', 'verse'] as const;

type PaginatedListInput = Exclude<ProjectListInput, 'filters'>;
interface PaginatedListArgs {
  input?: PaginatedListInput | null;
}
interface PaginatedList<Item> {
  readonly __typename?: string;
  readonly items: readonly Item[];
  readonly total: number;
  readonly hasMore: boolean;
}
const mergeIncomingPageItems = <List extends PaginatedList<unknown>>(
  existing: List | undefined,
  incoming: List,
  { args }: FieldFunctionOptions<PaginatedListArgs>
): List => {
  const count = args?.input?.count;
  const page = args?.input?.page;
  const DEFAULT_COUNT = 10;
  const existingItems = existing?.items ?? [];
  const startNew = (page ?? 1) * (count ?? DEFAULT_COUNT) + 1;
  const endNew = (page ?? 1) * (count ?? DEFAULT_COUNT);
  const updatedItems = [
    ...existingItems.slice(0, startNew),
    ...incoming.items,
    ...existingItems.slice(endNew),
  ];
  return {
    ...incoming,
    items: updatedItems,
  };
};

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
  Query: {
    fields: {
      projects: {
        merge: mergeIncomingPageItems,
      },
      languages: {
        merge: mergeIncomingPageItems,
      },
      partners: {
        merge: mergeIncomingPageItems,
      },
      users: {
        merge: mergeIncomingPageItems,
      },
    },
  },
};
