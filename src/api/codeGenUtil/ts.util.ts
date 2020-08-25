import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers/types';
import { GraphQLSchema } from 'graphql';
import {
  IndentationText,
  Node,
  ObjectLiteralExpression,
  Project,
  QuoteKind,
  SourceFile,
  SyntaxKind,
} from 'ts-morph';
import { Promisable } from 'type-fest';

interface PluginParams<T> {
  schema: GraphQLSchema;
  documents: Types.DocumentFile[];
  config: T;
  info?: {
    outputFile?: string;
    allPlugins?: Types.ConfiguredPlugin[];
    [key: string]: any;
  };
  project: Project;
}

export const tsMorphPlugin = <T>(
  plugin: (params: PluginParams<T>) => Promisable<SourceFile>
): PluginFunction<T> => async (schema, documents, config, info) => {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Single,
      useTrailingCommas: true,
    },
  });

  const result = await plugin({
    schema,
    documents,
    config,
    info,
    project,
  });

  result.formatText();
  return result.getFullText();
};

export const getOrCreateSubObjects = (
  exp: ObjectLiteralExpression,
  ...names: string[]
) => {
  let current = exp;
  for (const name of names) {
    current = getOrCreateSubObject(current, name);
  }
  return current;
};

const getOrCreateSubObject = (exp: ObjectLiteralExpression, name: string) =>
  (
    getPropertyAssignment(exp, name) ??
    exp.addPropertyAssignment({
      name,
      initializer: '{}',
    })
  ).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

export const getPropertyAssignment = (
  exp: ObjectLiteralExpression,
  name: string
) => {
  const prop = exp.getProperty(name);
  if (prop && Node.isPropertyAssignment(prop)) {
    return prop;
  }
  return undefined;
};
