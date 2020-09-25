import type {
  FieldPolicy,
  FieldReadFunction,
  KeyFieldsFunction,
} from '@apollo/client/cache/inmemory/policies';
import type { GqlTypeMap } from '../typeMap.generated';
import { ProjectListOutput, QueryProjectsArgs } from '..';

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
        merge(
          existing: ProjectListOutput | undefined,
          incoming: ProjectListOutput,
          { args }: { args: QueryProjectsArgs | null }
        ) {
          const count = args?.input?.count;
          const page = args?.input?.page;
          const DEFAULT_COUNT = 10;
          const existingProjects = existing?.items ?? [];
          const startNew = (page ?? 1) * (count ?? DEFAULT_COUNT) + 1;
          const endNew = (page ?? 1) * (count ?? DEFAULT_COUNT);
          const updatedProjects = [
            ...existingProjects.slice(0, startNew),
            ...incoming.items,
            ...existingProjects.slice(endNew),
          ];
          return {
            ...incoming,
            items: updatedProjects,
          };
        },
        read(existing: ProjectListOutput | undefined) {
          return existing;
        },
      },
    },
  },
};
