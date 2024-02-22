import { SetNonNullable, SetRequired } from 'type-fest';
import { ChangesetIdFragment, IdFragment } from '~/common';

export const hasChangeset = (
  data: IdFragment
): data is SetNonNullable<
  SetRequired<ChangesetIdFragment, 'changeset'>,
  'changeset'
> => 'changeset' in data && !!data.changeset;

export const getChangeset = (data: IdFragment) =>
  hasChangeset(data) ? data.changeset : undefined;
