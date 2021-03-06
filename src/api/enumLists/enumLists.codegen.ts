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
    moduleSpecifier: '../schema.generated',
  });

  for (const type of Object.values(schema.getTypeMap())) {
    if (!(type instanceof GraphQLEnumType) || type.name.startsWith('__')) {
      continue;
    }

    addExportedConst(file, {
      name: `${type.name}List`,
      type: `readonly Types.${type.name}[]`,
      initializer: writeStringArray(type.getValues().map((val) => val.name)),
    });
  }
});
