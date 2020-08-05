import { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { IndentationText, Project, QuoteKind, SyntaxKind } from 'ts-morph';
import { generateScalars } from './scalars/scalars.codegen';

export const plugin: PluginFunction = (schema, documents, config, _info) => {
  const project = new Project({
    tsConfigFilePath: 'tsconfig.json',
    manipulationSettings: {
      indentationText: IndentationText.TwoSpaces,
      quoteKind: QuoteKind.Single,
      useTrailingCommas: true,
    },
  });
  const dir = './src/api/typePolicies';
  const base = project.getSourceFileOrThrow(`${dir}/typePolicies.base.ts`);
  const newGenFile = base.copy(`${dir}/typePolicies.generated.ts`, {
    overwrite: true,
  });
  const typePolicies = newGenFile
    .getVariableDeclarationOrThrow('typePolicies')
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  generateScalars(schema, newGenFile, typePolicies);

  return newGenFile.getFullText();
};
