import type { Printer } from '@apollo/client/link/http/selectHttpOptionsAndBody';
import { isDocumentNode } from '@apollo/client/utilities';
import { Kind } from 'graphql';
import { uniqBy } from 'lodash';

/**
 * Removes duplicate fragments before printing.
 *
 * This happens because our generated documents can contain duplicates.
 * Say an operation uses fragments A & B, but B also uses A as well.
 * The generated json just flattens all definitions together, so [operation, A, B, A].
 * However, in src code it's actually merging from imports, so [operation, ...[A], ...[B, A]].
 * I think using this generation approach of importing fragment definitions is better.
 * It keeps the bundle size down. The less favorable option is to inline the
 * fragment definitions in every usage.
 */
export const dedupeFragmentsPrinter: Printer = (node, print) => {
  if (!isDocumentNode(node)) {
    return print(node);
  }
  const uniqDefs = uniqBy(node.definitions, (def) =>
    def.kind === Kind.FRAGMENT_DEFINITION ? def.name.value : def
  );
  const uniq = {
    ...node,
    definitions: uniqDefs,
  };
  return print(uniq);
};
