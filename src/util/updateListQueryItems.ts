import type { Reference } from '@apollo/client';
import type { MutationUpdaterFn } from '@apollo/client/core';
import { StoreObject } from '@apollo/client/utilities';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import type { DefinitionNode, ExecutableDefinitionNode } from 'graphql';
import type { ConditionalKeys } from 'type-fest';
import type { Query } from '../api';
import type { Nullable } from './types';

interface PaginatedList<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly hasMore: boolean;
}

// Only the keys of T that represent list fields.
type ListFieldKeys<T> = ConditionalKeys<T, Nullable<PaginatedList<any>>>;

type ObjectWithField<Obj extends StoreObject> =
  | [existingObject: Obj, field: ListFieldKeys<Obj>]
  | [ref: Reference, field: string];

/**
 * Use this on a mutation's update option to add the newly created item to an
 * existing cached list.
 *
 * @example
 * const [createFoo] = useMutation(CreateFooDoc, {
 *   update: addItemToList(
 *     // A gql query called `foos`
 *     'foos',
 *     // The item fragment used both the list and the mutation result.
 *     FooFragmentDoc,
 *     // Grabbing the newly created item from the output of the mutation
 *     (res) => res.createFoo.foo
 *   )
 * }
 *
 * @example
 * const [createMember] = useMutation(CreateMemberDoc, {
 *   update: addItemToList(
 *     // An existing object with a members list
 *     [project, 'members'],
 *     MemberFragmentDoc,
 *     (res) => res.createMember.member
 *   )
 * }
 *
 * @param whichList Which list to add to.
 *                  This can be the name of a root level query that returns a list
 *                  or a tuple of an object and the name of its list field.
 * @param itemFragment The fragment representing the item's shape. This should
 *                     probably be used in both the list and the mutation.
 * @param outputToItem A function describing how to get to the item from the mutation's result
 */
export const addItemToList = <
  OwningObj extends { id: string },
  Item extends { id: string },
  MutationOutput
>(
  whichList: ListFieldKeys<Query> | ObjectWithField<OwningObj>,
  itemFragment: DocumentNode<Item, unknown>,
  outputToItem: (out: MutationOutput) => Item
): MutationUpdaterFn<MutationOutput> => (cache, { data }) => {
  const [id, field] = Array.isArray(whichList)
    ? [cache.identify(whichList[0]), whichList[1]]
    : [undefined, whichList];
  cache.modify({
    id,
    fields: {
      [field](
        existingItemRefs: Nullable<PaginatedList<Reference>>,
        { readField }
      ): Nullable<PaginatedList<Reference>> {
        if (!data) return existingItemRefs;

        const newItem = outputToItem(data);

        const newItemRef = cache.writeFragment({
          data: newItem,
          fragment: itemFragment,
          // writeFragment wants the fragment name to use when the doc has
          // multiple. We can safely assume these are all sub-fragments being
          // referenced, and the first one is the one we want.
          fragmentName: getFirstExecutableName(itemFragment),
        });

        if (
          !newItemRef ||
          !existingItemRefs ||
          existingItemRefs.items.some(
            (ref) => readField('id', ref) === newItem.id
          )
        ) {
          return existingItemRefs;
        }

        return {
          ...existingItemRefs,
          total: Number(existingItemRefs.total) + 1,
          items: [newItemRef, ...existingItemRefs.items],
        };
      },
    },
  });
};

const getFirstExecutableName = (document: DocumentNode<unknown, unknown>) => {
  const firstDef = document.definitions.find(isExecutableDef);
  return firstDef?.name?.value;
};

const isExecutableDef = (
  def: DefinitionNode
): def is ExecutableDefinitionNode =>
  def.kind === 'OperationDefinition' || def.kind === 'FragmentDefinition';
