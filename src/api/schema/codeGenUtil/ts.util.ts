import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { GraphQLSchema } from 'graphql';
import {
  CodeBlockWriter,
  IndentationText,
  Node,
  ObjectLiteralExpression,
  OptionalKind,
  printNode,
  Project,
  QuoteKind,
  SourceFile,
  SyntaxKind,
  ts,
  VariableDeclarationKind,
  VariableDeclarationStructure,
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
  file: SourceFile;
}

export const tsMorphPlugin =
  <T>(
    plugin: (params: PluginParams<T>) => Promisable<SourceFile | void>
  ): PluginFunction<T> =>
  async (schema, documents, config, info) => {
    const project = new Project({
      tsConfigFilePath: 'tsconfig.json',
      manipulationSettings: {
        indentationText: IndentationText.TwoSpaces,
        quoteKind: QuoteKind.Single,
        useTrailingCommas: true,
      },
    });

    const baseFilePath = info?.outputFile?.replace('.generated.ts', '.base.ts');
    const base = baseFilePath ? project.getSourceFile(baseFilePath) : undefined;
    const file = base
      ? base.copy(info!.outputFile!, { overwrite: true })
      : project.createSourceFile('__temp.ts', '', { overwrite: true });

    const out = (await plugin({
      schema,
      documents,
      config,
      info,
      project,
      file,
    })) as SourceFile | undefined;
    const result = out ?? file;

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

export const getOrCreateSubList = (
  exp: ObjectLiteralExpression,
  name: string
) =>
  (
    getPropertyAssignment(exp, name) ??
    exp.addPropertyAssignment({
      name,
      initializer: '[]',
    })
  ).getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);

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

export const addExportedConst = (
  file: SourceFile,
  declaration: OptionalKind<VariableDeclarationStructure>
) => {
  const statement = file.addVariableStatement(exportedConst(declaration));
  return statement.getDeclarations()[0]!;
};

export const exportedConst = (
  declaration: OptionalKind<VariableDeclarationStructure>
) => ({
  isExported: true,
  declarationKind: VariableDeclarationKind.Const,
  declarations: [declaration],
  leadingTrivia: '\n',
  trailingTrivia: '\n',
});

export const writeStringArray = (items: readonly string[]) =>
  writeArray(items.map((item) => ts.factory.createStringLiteral(item, true)));

export const writeArray =
  (items: ReadonlyArray<ts.Expression | string>) =>
  (writer: CodeBlockWriter) => {
    writer.writeLine('[');
    for (const item of items) {
      const str = typeof item === 'string' ? item : printNode(item);
      writer.writeLine(str + ',');
    }
    writer.write(']');
  };
