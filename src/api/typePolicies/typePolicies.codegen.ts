import { SyntaxKind } from 'ts-morph';
import { tsMorphPlugin } from '../codeGenUtil/ts.util';
import { generateDeletes } from './deletes/deletes.codegen';
import { generateIdLookupRedirects } from './id-lookup/id-lookup.codegen';
import { generateLists } from './lists/lists.codegen';
import { generateScalars } from './scalars/scalars.codegen';

export const plugin = tsMorphPlugin(({ schema, file }) => {
  const typePolicies = file
    .getVariableDeclarationOrThrow('typePolicies')
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  generateScalars(schema, file, typePolicies);
  generateLists(schema, file, typePolicies);
  generateDeletes(schema, file, typePolicies);
  generateIdLookupRedirects(schema, file, typePolicies);
});
