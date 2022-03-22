import { GraphQLEnumType } from 'graphql';
import {
  addExportedConst,
  tsMorphPlugin,
  writeStringArray,
} from '../codeGenUtil/ts.util';

export const plugin = tsMorphPlugin(({ schema, file }) => {
  file.addImportDeclaration({
    isTypeOnly: true,
    namespaceImport: 'Types',
    moduleSpecifier: '../schema.graphql',
  });

  for (const type of Object.values(schema.getTypeMap())) {
    if (!(type instanceof GraphQLEnumType) || type.name.startsWith('__')) {
      continue;
    }

    const values = type
      .getValues()
      .filter((val) => !val.deprecationReason)
      .map((val) => val.name);

    addExportedConst(file, {
      name: `${type.name}List`,
      type: `readonly Types.${type.name}[]`,
      initializer: writeStringArray(values),
    });
  }
});
