import { GraphQLSchema, isObjectType } from 'graphql';
import { ObjectLiteralExpression, SourceFile } from 'ts-morph';
import { getSchemaTypes, resolveType } from '../gql.util';
import { getOrCreateSubObjects } from '../ts.util';

export const generateSecured = (
  schema: GraphQLSchema,
  file: SourceFile,
  typePolicies: ObjectLiteralExpression
) => {
  for (const val of getSchemaTypes(schema).filter(isObjectType)) {
    // Set Secured Types to disable normalization
    // This tells Apollo that they should just be cached on their parent object
    // https://www.apollographql.com/docs/react/caching/cache-configuration/#disabling-normalization
    if (val.name.startsWith('Secured')) {
      const policy = getOrCreateSubObjects(typePolicies, val.name);
      policy.addPropertyAssignment({
        name: 'keyFields',
        initializer: 'false',
      });
    }

    // Since secured types are not normalized, Apollo just replaces the secured
    // object instead of merging its values. We have to re-enable this merge
    // functionality explicitly below.
    // This prevents a prop, i.e. canEdit, from being deleted from the cache
    // when a later query doesn't include it. This causes the client to have to
    // do the query again, when going back to the originally cached query.
    for (const field of Object.values(val.getFields())) {
      const { type } = resolveType(field);
      if (!(isObjectType(type) && type.name.startsWith('Secured'))) {
        continue;
      }
      const fieldDef = getOrCreateSubObjects(
        typePolicies,
        val.name,
        'fields',
        field.name
      );
      if (fieldDef.getProperty('merge')) {
        continue;
      }
      fieldDef.addPropertyAssignment({
        name: 'merge',
        initializer: 'true',
      });
    }
  }
};
