import { GraphQLSchema, isNonNullType, isObjectType } from 'graphql';
import { GraphQLField } from 'graphql/type/definition';
import { difference } from 'lodash';
import { ObjectLiteralExpression, SourceFile } from 'ts-morph';
import { getSchemaTypes } from '../../codeGenUtil/gql.util';
import { getOrCreateSubObjects } from '../../codeGenUtil/ts.util';

const isListField = (field: GraphQLField<any, any>) =>
  isNonNullType(field.type) &&
  isObjectType(field.type.ofType) &&
  difference(
    ['items', 'total', 'hasMore'],
    Object.keys(field.type.ofType.getFields())
  ).length === 0;

export const generateLists = (
  schema: GraphQLSchema,
  file: SourceFile,
  typePolicies: ObjectLiteralExpression
) => {
  for (const typeNode of getSchemaTypes(schema).filter(isObjectType)) {
    for (const field of Object.values(typeNode.getFields()).filter(
      isListField
    )) {
      const { sort, order } =
        field.args.find((arg) => arg.name === 'input')?.defaultValue ?? {};
      const defaultSort =
        sort && order ? `{ sort: '${sort}', order: '${order}' }` : '';

      const fieldDef = getOrCreateSubObjects(
        typePolicies,
        typeNode.name,
        'fields'
      );
      if (fieldDef.getProperty(field.name)) {
        continue;
      }
      fieldDef.addPropertyAssignment({
        name: field.name,
        initializer: `pageLimitPagination(${defaultSort})`,
      });
    }
  }
};
