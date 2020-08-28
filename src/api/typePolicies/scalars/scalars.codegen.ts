import { GraphQLSchema, isObjectType, isScalarType } from 'graphql';
import { ObjectLiteralExpression, SourceFile } from 'ts-morph';
import { getSchemaTypes, resolveType } from '../../codeGenUtil/gql.util';
import { getOrCreateSubObjects } from '../../codeGenUtil/ts.util';

const builtInScalars = ['Boolean', 'ID', 'Int', 'Float', 'String'];

export const generateScalars = (
  schema: GraphQLSchema,
  file: SourceFile,
  typePolicies: ObjectLiteralExpression
) => {
  file.addImportDeclaration({
    namedImports: ['optional', 'Parsers'],
    moduleSpecifier: './scalars/scalars.parser',
  });

  for (const val of getSchemaTypes(schema).filter(isObjectType)) {
    for (const field of Object.values(val.getFields())) {
      const { type, required } = resolveType(field);
      if (!isScalarType(type) || builtInScalars.includes(type.name)) {
        continue;
      }

      const fieldDef = getOrCreateSubObjects(
        typePolicies,
        val.name,
        'fields',
        field.name
      );
      if (fieldDef.getProperty('read')) {
        continue;
      }

      let mapper = `Parsers.${type.name}`;
      if (!required) {
        mapper = `optional(${mapper})`;
      }
      fieldDef.addPropertyAssignment({
        name: 'read',
        initializer: mapper,
      });
    }
  }
};
