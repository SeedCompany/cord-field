import { Merge } from 'type-fest';
import { has } from '../../util';
import { ChangesetIdFragment, IdFragment } from '../fragments';

export const hasChangeset = (
  data: IdFragment
): data is Merge<
  IdFragment,
  Merge<
    ChangesetIdFragment,
    { changeset: NonNullable<ChangesetIdFragment['changeset']> }
  >
> => has('changeset', data) && !!data.changeset;

export const getChangeset = (data: IdFragment) =>
  hasChangeset(data) ? data.changeset : undefined;
