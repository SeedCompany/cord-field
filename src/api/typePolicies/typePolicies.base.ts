import type {
  FieldFunctionOptions,
  FieldPolicy,
  FieldReadFunction,
  KeyFieldsFunction,
} from '@apollo/client/cache/inmemory/policies';
import type { GqlTypeMap } from '../typeMap.generated';
import { Scalars } from '..';

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

const scriptureKeyFields = ['book', 'chapter', 'verse'] as const;

interface ItemOutput<Item> {
  readonly __typename: any;
  readonly items: Item[];
  readonly total: Scalars['Int'];
  readonly hasMore: Scalars['Boolean'];
}

type IncomingPageItemsMerge = <Item>(
  existing: ItemOutput<Item> | undefined,
  incoming: ItemOutput<Item>,
  options: FieldFunctionOptions
) => ItemOutput<Item>;

const mergeIncomingPageItems: IncomingPageItemsMerge = (
  existing,
  incoming,
  { args }
) => {
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
        read: (existing) => existing,
      },
      languages: {
        merge: mergeIncomingPageItems,
        read: (existing) => existing,
      },
      partners: {
        merge: mergeIncomingPageItems,
        read: (existing) => existing,
      },
      users: {
        merge: mergeIncomingPageItems,
        read: (existing) => existing,
      },
    },
  },
};
