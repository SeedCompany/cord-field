import { GraphQLNamedType, isObjectType } from 'graphql';
import { difference, sortBy } from 'lodash';
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

  const mainTypes = userDefinedTypes.filter(
    (t) =>
      !t.name.startsWith('Secured') &&
      !t.name.startsWith('Create') &&
      !t.name.startsWith('Update') &&
      !t.name.endsWith('Output')
  );
  const mainTsType = file.addInterface({
    name: 'GqlTypeMapMain',
    isExported: true,
    properties: getProperties(mainTypes),
  });

  const auxTypes = difference(userDefinedTypes, mainTypes);
  file.addInterface({
    name: 'GqlTypeMap',
    isExported: true,
    extends: [mainTsType.getName()],
    properties: getProperties(auxTypes),
  });
});

const getProperties = (types: readonly GraphQLNamedType[]) =>
  sortBy(types, (type) => type.name).map(
    (type): OptionalKind<PropertySignatureStructure> => ({
      name: type.name,
      type: `Types.${type.name}`,
    })
  );
