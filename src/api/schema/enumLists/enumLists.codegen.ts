import { GraphQLEnumType, GraphQLEnumValue } from 'graphql';
import { groupBy, lowerCase, mapValues } from 'lodash';
import { titleCase } from 'title-case';
import { mapFromList } from '../../../util';
import {
  addExportedConst,
  tsMorphPlugin,
  writeObject,
  writeString,
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

    const labelMap = mapFromList(values, (val) => {
      const label = descriptionTag(val, 'label') ?? smartLabel(val.name);
      return [val.name, label];
    });
    addExportedConst(file, {
      name: `${type.name}Labels`,
      type: `Readonly<Record<Types.${type.name}, string>>`,
      initializer: writeObject(labelMap, { value: writeString }),
    });

    const groupMap = mapValues(
      groupBy(values, (val) => descriptionTag(val, 'group') ?? ''),
      (vals) => vals.map((v) => v.value)
    );
    addExportedConst(file, {
      name: `${type.name}Groups`,
      type: `Readonly<Record<string, ReadonlyArray<Types.${type.name}>>>`,
      initializer: writeObject(groupMap, {
        key: writeString,
        value: writeStringArray,
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
