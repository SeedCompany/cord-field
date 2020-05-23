import { TypePolicies } from '@apollo/client';
import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { GraphQLNonNull, GraphQLObjectType, GraphQLScalarType } from 'graphql';
import { set } from 'lodash';

const builtInScalars = ['Boolean', 'ID', 'Int', 'Float', 'String'];

export const plugin: PluginFunction<
  {
    parserImport: string;
  },
  string
> = (schema, documents, config, _info) => {
  const typePolicies: TypePolicies = {};
  for (const val of Object.values(schema.getTypeMap())) {
    if (!(val instanceof GraphQLObjectType)) {
      continue;
    }
    for (const field of Object.values(val.getFields())) {
      let type = field.type;
      let required = false;
      if (type instanceof GraphQLNonNull) {
        required = true;
        type = type.ofType;
      }
      if (
        !(type instanceof GraphQLScalarType) ||
        builtInScalars.includes(type.name)
      ) {
        continue;
      }
      let mapper = `Parsers.${type.name}`;
      if (!required) {
        mapper = `optional(${mapper})`;
      }
      set(typePolicies, [val.name, 'fields', field.name, 'read'], mapper);
    }
  }

  const content = JSON.stringify(typePolicies, undefined, 2).replace(/"/g, '');

  // language=TypeScript
  return `
import { TypePolicies } from '@apollo/client';
import { Parsers } from '${config.parserImport}';

const optional = <T, R>(parser: (val: T) => R) => (
  val: T | null | undefined
): R | null => (val != null ? parser(val) : null);

export const typePolicies: TypePolicies = ${content}
`;
};
