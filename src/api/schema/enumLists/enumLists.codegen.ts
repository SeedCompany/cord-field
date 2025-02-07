import { sortBy } from '@seedcompany/common';
import { pascalCase } from 'change-case-all';
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

    // Same function that gql code gen uses
    const typeName = pascalCase(type.name);

    const values = type.getValues();

    addExportedConst(file, {
      name: `${typeName}List`,
      type: `readonly Types.${typeName}[]`,
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
      name: `${typeName}Labels`,
      type: `Readonly<Record<Types.${typeName}, string>>`,
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
