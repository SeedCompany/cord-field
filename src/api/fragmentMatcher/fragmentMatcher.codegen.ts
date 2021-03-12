import { isAbstractType } from 'graphql';
import {
  OptionalKind,
  PropertyAssignmentStructure,
  SyntaxKind,
} from 'ts-morph';
import { getSchemaTypes } from '../codeGenUtil/gql.util';
import { tsMorphPlugin, writeStringArray } from '../codeGenUtil/ts.util';

export const plugin = tsMorphPlugin(({ schema, file }) => {
  const props = getSchemaTypes(schema)
    .filter(isAbstractType)
    .map(
      (type): OptionalKind<PropertyAssignmentStructure> => ({
        name: type.name,
        initializer: writeStringArray(
          schema.getPossibleTypes(type).map((possible) => possible.name)
        ),
      })
    );

  file
    .getVariableDeclarationOrThrow('possibleTypes')
    .getInitializerIfKindOrThrow(SyntaxKind.AsExpression)
    .getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .addPropertyAssignments(props);
});
