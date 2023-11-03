import { sortBy } from '@seedcompany/common';
import { GraphQLEnumType, GraphQLEnumValue } from 'graphql';
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
        sortBy(
          values.filter((val) => !val.deprecationReason),
          (val) => {
            const order = descriptionTag(val, 'order');
            return order ? Number(order) : Infinity;
          }
        ).map((val) => val.name)
      ),
    });

    addExportedConst(file, {
      name: `${type.name}Labels`,
      type: `Readonly<Record<Types.${type.name}, string>>`,
      initializer: (writer) =>
        writer.block(() => {
          for (const val of values) {
            const label = descriptionTag(val, 'label') ?? smartLabel(val.name);
            writer.writeLine(`${val.name}: \`${label}\`,`);
          }
        }),
    });
  }
});

const descriptionTag = (val: GraphQLEnumValue, tag: string) =>
  val.description
    ? new RegExp(`^\\s*@${tag} (.+)$`, 'm').exec(val.description)?.[1]?.trim()
    : undefined;

const smartLabel = (str: string) =>
  titleCase(lowerCase(str)).replace(/ and /g, ' & ');
