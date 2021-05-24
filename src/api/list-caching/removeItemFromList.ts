import type { MutationUpdaterFn } from '@apollo/client/core';
import { Except } from 'type-fest';
import { ListModifier, modifyList, ModifyListOptions } from './modifyList';

/**
 * Use this on a mutation's update option to remove the deleted item from an
 * existing cached list.
 *
 * @example
 * const [createFoo] = useMutation(DeleteFooDoc, {
 *   update: removeItemFromList({
 *     // A gql query called `foos`
 *     listId: 'foos',
 *     item: foo,
 *   })
 * })
 *
 * @example
 * const [createMember] = useMutation(DeleteMemberDoc, {
 *   update: removeItemFromList({
 *     // An existing object with a members list
 *     listId: [project, 'members'],
 *     item: member,
 *   })
 * })
 */
export const removeItemFromList =
  <
    OwningObj extends { id: string },
    Item extends { __typename?: string; id: string },
    Args
  >({
    listId,
    filter,
    item,
  }: Except<ModifyListOptions<OwningObj, Args>, 'cache' | 'modifier'> & {
    item: Item;
  }): MutationUpdaterFn<unknown> =>
  (cache, { data }) => {
    if (!data) {
      return;
    }

    const modifier: ListModifier = (existing, { readField }) => {
      if (
        !existing ||
        !existing.items.some((ref) => readField('id', ref) === item.id)
      ) {
        return existing;
      }

      const newList = existing.items.filter(
        (ref) => readField('id', ref) !== item.id
      );

      return {
        ...existing,
        total: Number(existing.total) - 1,
        items: newList,
      };
    };

    modifyList({ cache, listId, modifier, filter });
  };
