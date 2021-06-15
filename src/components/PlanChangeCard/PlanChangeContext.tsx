import { makeQueryHandler, StringParam, withKey } from '../../hooks';
import { Nullable } from '../../util';

const useCurrentChangesetUrlState = makeQueryHandler({
  changeset: withKey(StringParam, 'chgset'),
});

export const useCurrentChangeset = () => {
  const [{ changeset }, set] = useCurrentChangesetUrlState();
  const update = (nextChangeset: Nullable<string>) => {
    set({ changeset: nextChangeset }, { push: true });
  };
  return [changeset, update] as const;
};
