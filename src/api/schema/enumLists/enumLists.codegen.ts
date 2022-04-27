import { GraphQLEnumType } from 'graphql';
import { lowerCase } from 'lodash';
import { titleCase } from 'title-case';
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

    const values = type.getValues();

    addExportedConst(file, {
      name: `${type.name}List`,
      type: `readonly Types.${type.name}[]`,
      initializer: writeStringArray(
        values.filter((val) => !val.deprecationReason).map((val) => val.name)
      ),
    });

    addExportedConst(file, {
      name: `${type.name}Labels`,
      type: `Readonly<Record<Types.${type.name}, string>>`,
      initializer: (writer) =>
        writer.block(() => {
          for (const val of values) {
            const label =
              (val.description
                ? /^\s*@label (.+)$/m.exec(val.description)?.[1]
                : undefined
              )?.replace(/`/g, '\\`') ??
              titleCase(lowerCase(val.name)).replace(/ and /g, ' & ');
            writer.writeLine(`${val.name}: \`${label}\`,`);
          }
        }),
    });
  }
});
