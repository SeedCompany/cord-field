import {
  GraphQLArgument,
  GraphQLField,
  GraphQLSchema,
  isAbstractType,
  isNonNullType,
  isObjectType,
  isScalarType,
} from 'graphql';
import {
  GraphQLCompositeType,
  GraphQLObjectType,
  GraphQLOutputType,
} from 'graphql/type/definition';
import { ObjectLiteralExpression, SourceFile } from 'ts-morph';
import { getOrCreateSubObjects } from '../../codeGenUtil/ts.util';

const isId = (arg: GraphQLArgument | GraphQLField<unknown, unknown>) =>
  arg.name === 'id' &&
  isNonNullType(arg.type) &&
  isScalarType(arg.type.ofType) &&
  arg.type.ofType.name === 'ID';

const isObjectWithId = (type: GraphQLOutputType): type is GraphQLObjectType =>
  isObjectType(type) && Object.values(type.getFields()).some(isId);

const isOutputTypeAnEntity = (
  type: GraphQLOutputType,
  schema: GraphQLSchema
): type is GraphQLCompositeType =>
  isObjectWithId(type) ||
  (isAbstractType(type) && schema.getPossibleTypes(type).every(isObjectWithId));

export const generateIdLookupRedirects = (
  schema: GraphQLSchema,
  file: SourceFile,
  typePolicies: ObjectLiteralExpression
) => {
  const queries = schema.getQueryType();
  if (!queries) {
    return;
  }
  const queryPolicies = getOrCreateSubObjects(typePolicies, 'Query', 'fields');

  for (const query of Object.values(queries.getFields())) {
    const acceptsId = query.args.some(isId);
    const type = isNonNullType(query.type) ? query.type.ofType : undefined;
    if (
      !acceptsId ||
      !type ||
      !isOutputTypeAnEntity(type, schema) ||
      queryPolicies.getProperty(query.name)
    ) {
      continue;
    }

    queryPolicies.addPropertyAssignment({
      name: query.name,
      initializer: `redirectToTypeById('${type.name}')`,
    });
  }

  file.fixMissingImports();
};
