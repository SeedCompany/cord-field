import { ApolloCache, MutationUpdaterFn } from '@apollo/client';
import { ProjectPartnershipsQuery } from '../List/PartnershipList.generated';

export const invalidateOldPrimaryPartnership = <R>(
  project: ProjectPartnershipsQuery['project']
): MutationUpdaterFn<R> => (cache: ApolloCache<unknown>) => {
  const oldPrimaryPartnership = project.partnerships.items.find(
    (partnership) => partnership.primary.value === true
  );
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
