import { ApolloCache, MutationUpdaterFunction } from '@apollo/client';
import { Except } from 'type-fest';
import { splice } from '~/common';
import { modifyChangesetDiff } from '../../changesets';
import { Entity } from '../../schema';
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
  <OwningObj extends { id: string }, Item extends Entity, Args>({
    listId,
    filter,
    item,
  }: Except<ModifyListOptions<OwningObj, Args>, 'cache' | 'modifier'> & {
    item: Item;
  }): MutationUpdaterFunction<
    unknown,
    unknown,
    unknown,
    ApolloCache<unknown>
  > =>
  (cache, { data }) => {
    if (!data) {
      return;
    }

    const modifier: ListModifier = (existing, { readField }) => {
      if (!existing?.items.some((ref) => readField('id', ref) === item.id)) {
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

    const objRef = Array.isArray(listId) ? listId[0] : undefined;
    if (!objRef) {
      return;
    }
    modifyChangesetDiff(cache, objRef, ({ added, removed }) => {
      const removedItemId = cache.identify(item as any);
      const addedInChangesetIndex = added.findIndex(
        (addedItem) => cache.identify(addedItem as any) === removedItemId
      );
      const addedInChangeset = addedInChangesetIndex >= 0;
      return {
        added: addedInChangeset
          ? splice(added, addedInChangesetIndex, 1)
          : added,
        removed: addedInChangeset ? removed : [...removed, item],
      };
    });
  };
