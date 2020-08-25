import { SyntaxKind } from 'ts-morph';
import { tsMorphPlugin } from '../codeGenUtil/ts.util';
import { generateScalars } from './scalars/scalars.codegen';
import { generateSecured } from './secured/secured.codegen';

export const plugin = tsMorphPlugin(({ schema, project }) => {
  const dir = './src/api/typePolicies';
  const base = project.getSourceFileOrThrow(`${dir}/typePolicies.base.ts`);
  const newGenFile = base.copy(`${dir}/typePolicies.generated.ts`, {
    overwrite: true,
  });
  const typePolicies = newGenFile
    .getVariableDeclarationOrThrow('typePolicies')
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  generateScalars(schema, newGenFile, typePolicies);
  generateSecured(schema, newGenFile, typePolicies);

  return newGenFile;
});
