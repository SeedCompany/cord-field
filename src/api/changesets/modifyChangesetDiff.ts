import { ApolloCache, Reference } from '@apollo/client';
import { pickBy } from 'lodash';
import { Entity } from '../list-caching';
import { updateFragment } from '../updateFragment';
import {
  ModifyChangesetDiffOnUpdateFragment,
  ModifyChangesetDiffOnUpdateFragmentDoc,
} from './ModifyChangesetDiffOnUpdate.generated';

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
    fragmentName: 'ModifyChangesetDiffOnUpdate',
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
            ...owningObj.changeset?.difference,
            ...result,
          }),
        },
      };
      return next as ModifyChangesetDiffOnUpdateFragment;
    },
  });
};
