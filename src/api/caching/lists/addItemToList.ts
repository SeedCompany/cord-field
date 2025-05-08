import {
  ApolloCache,
  MutationUpdaterFunction,
  Reference,
} from '@apollo/client';
import { isObjectLike, sortBy } from '@seedcompany/common';
import { Except } from 'type-fest';
import { unwrapSecuredEdge } from '~/common';
import { modifyChangesetDiff } from '../../changesets';
import type { Entity } from '../../schema';
import type { Order } from '../../schema.graphql';
import {
  argsFromStoreFieldName,
  defaultSortingForList,
  ListModifier,
  modifyList,
  ModifyListOptions,
} from './modifyList';
import { InputArg, SortableListInput } from './types';
import { sortingFromArgs } from './util';

/**
 * Use this on a mutation's update option to add the newly created item to an
 * existing cached list.
 *
 * @example
 * const [createFoo] = useMutation(CreateFooDoc, {
 *   update: addItemToList({
 *     // A gql query called `foos`
 *     listId: 'foos',
 *     // Grabbing the newly created item from the output of the mutation
 *     outputToItem: (res) => res.createFoo.foo
 *   })
 * })
 *
 * @example
 * const [createMember] = useMutation(CreateMemberDoc, {
 *   update: addItemToList({
 *     // An existing object with a members list
 *     listId: [project, 'members'],
 *     outputToItem: (res) => res.createMember.member
 *   })
 * })
 */
export const addItemToList =
  <
    OwningObj extends Entity,
    Item extends Entity,
    MutationOutput,
    Args = InputArg<SortableListInput>
  >({
    listId,
    filter,
    outputToItem,
  }: Except<ModifyListOptions<OwningObj, Args>, 'cache' | 'modifier'> & {
    // A function describing how to get to the item from the mutation's result
    outputToItem: (out: MutationOutput) => Item;
  }): MutationUpdaterFunction<
    MutationOutput,
    unknown,
    unknown,
    ApolloCache<unknown>
  > =>
  (cache, { data }) => {
    if (!data) {
      return;
    }

    const newItem = outputToItem(data);

    const modifier: ListModifier = (
      existing,
      { readField, storeFieldName, toReference }
    ) => {
      if (
        !existing ||
        existing.items.some((ref) => readField('id', ref) === newItem.id)
      ) {
        return existing;
      }

      // @ts-expect-error type is missing index signature, our type is actually narrower
      const newItemRef = toReference(newItem);
      if (!newItemRef) {
        return;
      }

      let newList: readonly Reference[] = [...existing.items, newItemRef];

      // Sort the new item appropriately given the list's sort/order params
      const args = argsFromStoreFieldName(storeFieldName);
      const { sort, order } = sortingFromArgs(
        args,
        defaultSortingForList(listId)
      );
      if (sort && order) {
        newList = sortBy(newList, [
          (ref) => {
            const fieldVal = sort.split('.').reduce((val, key, i, parts) => {
              if (!val) {
                return val;
              }
              const raw = readField(key, val);
              const nextKey = parts[i + 1];
              if (nextKey && isObjectLike(raw) && nextKey in raw) {
                return raw;
              }
              return unwrapSecuredEdge(raw);
            }, ref as any);
            // Unsafely assume this value is sortable
            return fieldVal;
          },
          order.toLowerCase() as Lowercase<Order>,
        ]);
      }

      return {
        ...existing,
        total: Number(existing.total) + 1,
        items: newList,
      };
    };

    modifyList({ cache, listId, modifier, filter });

    // If object given add resource to changeset diff added list
    const objRef = Array.isArray(listId) ? listId[0] : undefined;
    if (!objRef) {
      return;
    }
    modifyChangesetDiff(cache, objRef, ({ added }) => ({
      // TODO how are removed items reverted?
      added: [...added, newItem],
    }));
  };
