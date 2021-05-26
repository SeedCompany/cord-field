import { makeQueryHandler, StringParam, withKey } from '../../hooks';
import { Nullable } from '../../util';

const useCurrentPlanChangeUrlState = makeQueryHandler({
  changeId: withKey(StringParam, 'cr'),
});

export const useCurrentPlanChange = () => {
  const [{ changeId }, set] = useCurrentPlanChangeUrlState();
  const update = (nextChangeId: Nullable<string>) => {
    set({ changeId: nextChangeId }, { push: true });
  };
  return [changeId, update] as const;
};
