import { ApolloCache, MutationUpdaterFn } from '@apollo/client';
import { Partnership } from '../../../api';
import { ProjectPartnershipsQuery } from '../List/PartnershipList.generated';

export const updateOldPrimaryPartnership = <R>(
  project: ProjectPartnershipsQuery['project'],
  getUpdated: (res: R) => Pick<Partnership, 'id' | 'primary'>
): MutationUpdaterFn<R> => (cache: ApolloCache<unknown>, res) => {
  if (!res.data) {
    return;
  }
  const updated = getUpdated(res.data);
  if (!updated.primary.value) {
    // Updated isn't primary so there's nothing to do here.
    return;
  }

  const oldPrimaryPartnership = project.partnerships.items.find(
    (partnership) => partnership.id !== updated.id && partnership.primary.value
  );
  if (!oldPrimaryPartnership) {
    return;
  }

  cache.modify({
    id: cache.identify(oldPrimaryPartnership),
    fields: {
      primary: () => ({
        ...oldPrimaryPartnership.primary,
        value: false,
      }),
    },
  });
};