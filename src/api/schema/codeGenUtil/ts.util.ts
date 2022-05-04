import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers/types';
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
  WriterFunction,
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
  writeArray(items.map((item) => createStringLiteral(item)));

export const writeArray =
  (items: ReadonlyArray<ts.Expression | string>) =>
  (writer: CodeBlockWriter) => {
    writer.write('[\n');
    for (const item of items) {
      const str = typeof item === 'string' ? item : printNode(item);
      writer.writeLine(str + ',');
    }
    writer.write(']');
  };

export const writeObject =
  <V>(
    object: Record<string, V>,
    writers: {
      key?: (key: string) => WriterFunction;
      value: (value: V) => WriterFunction;
    }
  ): WriterFunction =>
  (writer) =>
    writer.block(() => {
      const writeKey = writers.key ?? writeRaw;
      for (const [key, val] of Object.entries(object)) {
        writeKey(key)(writer);
        writer.write(`: `);
        writers.value(val)(writer);
        writer.write(',\n');
      }
    });

export const writeString =
  (str: string, qoute = "'"): WriterFunction =>
  (writer) =>
    writer.write(
      `${qoute}${str.replace(new RegExp(qoute, 'g'), `\\${qoute}`)}${qoute}`
    );

const writeRaw =
  (str: string): WriterFunction =>
  (writer) =>
    writer.write(str);

export const createStringLiteral = (text: string, doubleQuote = false) => {
  const literal = ts.createStringLiteral(text);
  if (!doubleQuote) {
    // @ts-expect-error this is undocumented
    literal.singleQuote = true;
  }
  return literal;
};
