import { GraphQLSchema, isInterfaceType, isObjectType } from 'graphql';
import { ObjectLiteralExpression, SourceFile } from 'ts-morph';
import { getOrCreateSubObjects } from '../../codeGenUtil/ts.util';

export const generateDeletes = (
  schema: GraphQLSchema,
  file: SourceFile,
  typePolicies: ObjectLiteralExpression
) => {
  const mutations = schema.getMutationType();
  if (!mutations) {
    return;
  }
  const deleteMutations = Object.values(
    mutations.getFields()
  ).filter((mutation) => mutation.name.startsWith('delete'));
  for (const mutation of deleteMutations) {
    const objName = mutation.name.replace('delete', '');
    const objType = schema.getType(objName);
    const isEntity =
      objType &&
      (isObjectType(objType) || isInterfaceType(objType)) &&
      'id' in objType.getFields();
    if (!isEntity) {
      continue;
    }
    const fieldDef = getOrCreateSubObjects(typePolicies, 'Mutation', 'fields');
    if (fieldDef.getProperty(mutation.name)) {
      continue;
    }
    fieldDef.addPropertyAssignment({
      name: mutation.name,
      initializer: `handleDelete('${objName}')`,
    });
  }

  file.fixMissingImports();
};
