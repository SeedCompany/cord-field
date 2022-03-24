import { isAbstractType } from 'graphql';
import { SyntaxKind } from 'ts-morph';
import { getSchemaTypes } from '../codeGenUtil/gql.util';
import { getOrCreateSubList, tsMorphPlugin } from '../codeGenUtil/ts.util';

export const plugin = tsMorphPlugin(({ schema, file }) => {
  const possibleTypeMap = file
    .getVariableDeclarationOrThrow('possibleTypes')
    .getInitializerIfKindOrThrow(SyntaxKind.AsExpression)
    .getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  for (const abstractType of getSchemaTypes(schema).filter(isAbstractType)) {
    const list = getOrCreateSubList(possibleTypeMap, abstractType.name);

    const possibleTypes = schema
      .getPossibleTypes(abstractType)
      .map((possible) => `'${possible.name}'`);

    list.insertElements(0, possibleTypes, { useNewLines: true });
  }
});
