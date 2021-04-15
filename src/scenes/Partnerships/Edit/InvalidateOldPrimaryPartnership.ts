import { ApolloCache, MutationUpdaterFn } from '@apollo/client';
import { ProjectPartnershipsQuery } from '../List/PartnershipList.generated';

export const invalidateOldPrimaryPartnership = <R>(
  project: ProjectPartnershipsQuery['project']
): MutationUpdaterFn<R> => (cache: ApolloCache<unknown>) => {
  const filtered = project.partnerships.items.filter(
    (partnership) => partnership.primary.value === true
  );
  if (filtered.length === 0) {
    return;
  }

  const oldPrimaryPartnership = filtered[0];
  if (oldPrimaryPartnership) {
    cache.modify({
      id: cache.identify(oldPrimaryPartnership),
      fields: {
        primary: () => ({
          ...oldPrimaryPartnership.primary,
          value: false,
        }),
      },
    });
  }
};
