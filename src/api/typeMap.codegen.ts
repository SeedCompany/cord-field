import { isObjectType } from 'graphql';
import { sortBy } from 'lodash';
import { OptionalKind, PropertySignatureStructure } from 'ts-morph';
import { getSchemaTypes } from './codeGenUtil/gql.util';
import { tsMorphPlugin } from './codeGenUtil/ts.util';

export const plugin = tsMorphPlugin(({ schema, file }) => {
  file.addImportDeclaration({
    namespaceImport: 'Types',
    moduleSpecifier: './schema.generated',
    isTypeOnly: true,
  });

  const userDefinedTypes = getSchemaTypes(schema).filter(
    (type) =>
      isObjectType(type) &&
      !type.name.startsWith('__') &&
      type !== schema.getQueryType() &&
      type !== schema.getMutationType() &&
      type !== schema.getSubscriptionType()
  );

  file.addInterface({
    name: 'GqlTypeMap',
    isExported: true,
    properties: sortBy(userDefinedTypes, (type) => type.name).map(
      (type): OptionalKind<PropertySignatureStructure> => ({
        name: type.name,
        type: `Types.${type.name}`,
      })
    ),
  });
});
