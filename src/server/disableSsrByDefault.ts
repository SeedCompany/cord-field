import { NodePath, PluginObj } from '@babel/core';
import * as types from '@babel/types';
import {
  CallExpression,
  ImportSpecifier,
  isIdentifier,
  isImportDeclaration,
  isProperty,
  ObjectExpression,
  Program,
} from '@babel/types';

type Types = typeof types;

interface State {
  // List of imported names of useQuery.
  // Should typically just be `['useQuery']`
  names: string[];
}

// eslint-disable-next-line import/no-default-export
export default ({ types }: { types: Types }): PluginObj<State> => ({
  name: 'disable-apollo-ssr-by-default',
  visitor: {
    Program: (path: NodePath<Program>, state) => {
      // Reset list on new file
      state.names = [];
    },
    ImportSpecifier: (path: NodePath<ImportSpecifier>, state) => {
      // Add name to list if it matches
      if (
        path.node.imported.type === 'Identifier' &&
        path.node.imported.name === 'useQuery' &&
        isImportDeclaration(path.parent) &&
        path.parent.source.value === '@apollo/client'
      ) {
        state.names.push(path.node.local.name);
      }
    },
    CallExpression: (path: NodePath<CallExpression>, state) => {
      // Continue if we are a call to useQuery function
      if (
        !isIdentifier(path.node.callee) ||
        !state.names.includes(path.node.callee.name)
      ) {
        return;
      }

      // Find options argument or create new it
      const options =
        (path.node.arguments[1] as ObjectExpression | undefined) ||
        types.objectExpression([]);

      // Continue if options doesn't have a ssr
      if (options.properties.some(isPropertyName('ssr'))) {
        return;
      }

      // Add it to the options object
      options.properties.unshift(
        types.objectProperty(
          types.identifier('ssr'),
          types.booleanLiteral(false)
        )
      );

      // Replace function call with same one with options argument added.
      path.replaceWith(
        types.callExpression(path.node.callee, [
          path.node.arguments[0]!,
          options,
        ])
      );
    },
  },
});

const isPropertyName = (name: string) => (prop: types.Node) =>
  isProperty(prop) && isIdentifier(prop.key) && prop.key.name === name;
