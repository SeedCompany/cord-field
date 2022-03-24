import { GraphQLField, GraphQLSchema, isNonNullType } from 'graphql';

export const getSchemaTypes = (schema: GraphQLSchema) =>
  Object.values(schema.getTypeMap());

export const resolveType = (field: GraphQLField<any, any>) =>
  isNonNullType(field.type)
    ? { type: field.type.ofType, required: true }
    : { type: field.type, required: false };
