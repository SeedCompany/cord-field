import { ApolloCache, Reference } from '@apollo/client';
import { pickBy } from 'lodash';
import { updateFragment } from '../caching/updateFragment';
import { Entity } from '../schema';
import {
  ModifyChangesetDiffOnUpdateFragment,
  ModifyChangesetDiffOnUpdateFragmentDoc,
} from './ModifyChangesetDiffOnUpdate.graphql';

interface ModifyChangesetDiff {
  added: readonly Entity[];
  removed: readonly Entity[];
  changed: ReadonlyArray<{ previous: Entity; updated: Entity }>;
}

export const modifyChangesetDiff = (
  cache: ApolloCache<unknown>,
  obj: Entity | Reference,
  modifier: (diff: ModifyChangesetDiff) => Partial<ModifyChangesetDiff>
) => {
  updateFragment(cache, {
    object: obj,
    fragment: ModifyChangesetDiffOnUpdateFragmentDoc,
    updater: (owningObj) => {
      const diff = owningObj.changeset?.difference;
      if (!diff) {
        return;
      }
      // The type generation for resource interface is not responding well.
      const result = modifier(diff as ModifyChangesetDiff);
      const next = {
        ...owningObj,
        changeset: {
          ...owningObj.changeset,
          difference: pickBy({
            ...owningObj.changeset.difference,
            ...result,
          }),
        },
      };
      return next as ModifyChangesetDiffOnUpdateFragment;
    },
  });
};
