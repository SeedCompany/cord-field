import { plugin as basePlugin } from '@graphql-codegen/named-operations-object';
import type { PluginFunction } from '@graphql-codegen/plugin-helpers';
import { concatAST, FieldNode, visit } from 'graphql';

export const plugin: PluginFunction = async (...args) => {
  let result = await basePlugin(...args);
  result = result ? result + ' as const;' : result;

  const [schema, documents] = args;

  const queries = Object.values(schema.getQueryType()?.getFields() ?? {});
  const mutations = Object.values(schema.getMutationType()?.getFields() ?? {});
  const sensitiveQueries = new Set(
    [...queries, ...mutations]
      .filter(
        (f) => f.description && /^\s*@sensitive-secrets$/m.test(f.description)
      )
      .map((f) => f.name)
  );
  const sensitiveOperationsNames = new Set();
  const allAst = concatAST(documents.flatMap((v) => v.document ?? []));
  visit(allAst, {
    OperationDefinition: (node) => {
      if (
        !node.name ||
        (node.operation !== 'query' && node.operation !== 'mutation')
      ) {
        return;
      }
      const fields = node.selectionSet.selections
        .filter((s): s is FieldNode => s.kind === 'Field')
        .map((s) => s.name.value);
      for (const field of fields) {
        if (sensitiveQueries.has(field)) {
          sensitiveOperationsNames.add(node.name.value);
        }
      }
    },
  });

  result += `

export const GqlSensitiveOperations: ReadonlySet<string> = new Set([
${[...sensitiveOperationsNames].map((n) => `  '${n}'`).join(',\n')}
]);
`;

  return result;
};
