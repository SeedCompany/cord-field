'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const graphql_1 = require('graphql');
const lodash_1 = require('lodash');
const builtInScalars = ['Boolean', 'ID', 'Int', 'Float', 'String'];
exports.plugin = (schema, documents, config, _info) => {
  const typePolicies = {};
  for (const val of Object.values(schema.getTypeMap())) {
    if (!(val instanceof graphql_1.GraphQLObjectType)) {
      continue;
    }
    for (const field of Object.values(val.getFields())) {
      let type = field.type;
      let required = false;
      if (type instanceof graphql_1.GraphQLNonNull) {
        required = true;
        type = type.ofType;
      }
      if (
        !(type instanceof graphql_1.GraphQLScalarType) ||
        builtInScalars.includes(type.name)
      ) {
        continue;
      }
      let mapper = `Parsers.${type.name}`;
      if (!required) {
        mapper = `optional(${mapper})`;
      }
      lodash_1.set(
        typePolicies,
        [val.name, 'fields', field.name, 'read'],
        mapper
      );
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
