import { Merge } from 'type-fest';
import { ChangesetIdFragment, IdFragment } from '~/common';

export const hasChangeset = (
  data: IdFragment
): data is Merge<
  IdFragment,
  Merge<
    ChangesetIdFragment,
    { changeset: NonNullable<ChangesetIdFragment['changeset']> }
  >
> => 'changeset' in data && !!data.changeset;

export const getChangeset = (data: IdFragment) =>
  hasChangeset(data) ? data.changeset : undefined;
