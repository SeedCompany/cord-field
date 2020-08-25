import { GraphQLEnumType } from 'graphql';
import {
  addExportedConst,
  createStringLiteral,
  tsMorphPlugin,
  writeArray,
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
      initializer: (writer) => {
        writeArray(
          writer,
          type.getValues().map((val) => createStringLiteral(val.name))
        );
      },
    });
  }
});
