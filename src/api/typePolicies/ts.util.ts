import { Node, ObjectLiteralExpression, SyntaxKind } from 'ts-morph';

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
