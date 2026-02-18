import { ApolloCache, MutationUpdaterFunction, Unmasked } from '@apollo/client';
import { readFragment } from '~/api';
import { Partnership } from '~/api/schema.graphql';
import { IdFragment } from '~/common';
import { ProjectOldPrimaryPartnershipsFragmentDoc } from './projectOldPrimaryPartnerships.graphql';

export const updateOldPrimaryPartnership =
  <R>(
    project: IdFragment,
    getUpdated: (res: Unmasked<R>) => Pick<Partnership, 'id' | 'primary'>
  ): MutationUpdaterFunction<R, unknown, unknown, ApolloCache<unknown>> =>
  (cache: ApolloCache<unknown>, res) => {
    if (!res.data) {
      return;
    }
    const updated = getUpdated(res.data);
    if (!updated.primary.value) {
      // Updated isn't primary so there's nothing to do here.
      return;
    }

    const projectPartnershipInfo = readFragment(cache, {
      object: project,
      fragment: ProjectOldPrimaryPartnershipsFragmentDoc,
    });
    if (!projectPartnershipInfo) {
      return; // info that would be stale is not cached, nothing to do
    }
    const oldPrimaryPartnership =
      projectPartnershipInfo.partnerships.items.find(
        (partnership) =>
          partnership.id !== updated.id && partnership.primary.value
      );
    if (!oldPrimaryPartnership) {
      return;
    }

    cache.modify({
      id: cache.identify(oldPrimaryPartnership),
      fields: {
        primary: (existing) => ({
          ...existing,
          value: false,
        }),
      },
    });
  };
