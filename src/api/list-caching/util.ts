import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { DefinitionNode, ExecutableDefinitionNode } from 'graphql';
import { SortableListInput } from './types';

export const getFirstExecutableName = (
  document: DocumentNode<unknown, unknown>
) => document.definitions.find(isExecutableDef)?.name?.value;

export const isExecutableDef = (
  def: DefinitionNode
): def is ExecutableDefinitionNode =>
  def.kind === 'OperationDefinition' || def.kind === 'FragmentDefinition';

export const sortingFromArgs = (
  args: any,
  defaults?: SortableListInput
): SortableListInput => ({
  sort: args?.input?.sort ?? defaults?.sort,
  order: args?.input?.order ?? defaults?.order,
});
