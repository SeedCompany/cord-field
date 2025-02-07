import { sortBy } from '@seedcompany/common';
import { pascalCase } from 'change-case-all';
import { GraphQLNamedType, isAbstractType, isObjectType } from 'graphql';
import { difference } from 'lodash';
import { OptionalKind, PropertySignatureStructure } from 'ts-morph';
import { getSchemaTypes } from '../codeGenUtil/gql.util';
import { tsMorphPlugin } from '../codeGenUtil/ts.util';

export const plugin = tsMorphPlugin(({ schema, file }) => {
  file.addImportDeclaration({
    namespaceImport: 'Types',
    moduleSpecifier: '../schema.graphql',
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

  const abstractTypes = getSchemaTypes(schema).filter(isAbstractType);
  for (const abstractType of abstractTypes) {
    file.addTypeAlias({
      name: abstractType.name,
      type: schema
        .getPossibleTypes(abstractType)
        .map((possible) => `Types.${pascalCase(possible.name)}`)
        .join(' | '),
      isExported: true,
    });
  }

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
    properties: [
      ...getProperties(mainTypes),
      ...abstractTypes.map((type) => ({
        name: type.name,
        type: type.name,
      })),
    ],
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
      type: `Types.${pascalCase(type.name)}`,
    })
  );
