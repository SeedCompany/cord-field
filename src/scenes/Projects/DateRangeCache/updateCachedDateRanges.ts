import { ApolloCache } from '@apollo/client';
import { Modifier } from '@apollo/client/cache';
import { DeepPartial } from 'ts-essentials';
import { invalidateProps, updateFragment } from '~/api';
import { Project as ProjectShape } from '~/api/schema.graphql';
import { SecuredDateRangeFragment } from '~/common';
import {
  ProjectCachedEngagementDateRangesFragmentDoc,
  ProjectCachedPartnershipDateRangesFragmentDoc,
} from './CachedProjectDateRanges.graphql';

type Project = Pick<ProjectShape, 'id'>;
type SecuredDateRange = DeepPartial<SecuredDateRangeFragment>;

export const updateEngagementDateRanges = (
  cache: ApolloCache<unknown>,
  project: Project
) => {
  updateFragment(cache, {
    object: project,
    fragment: ProjectCachedEngagementDateRangesFragmentDoc,
    // We need override fields here but the engagement list doesn't have them.
    // If the user visits/caches one of the engagements we need to update that one
    // But without partial data, Apollo will correctly say that not all engagements
    // fulfill the shape requested and thus return null.
    // We want to allow some engagements to be missing data, and we'll account
    // for that in our update logic.
    returnPartialData: true,
    updater: (cached) => {
      for (const eng of cached.engagements?.items ?? []) {
        if (!eng) {
          continue;
        }
        updateDateCalcField(cache, eng, 'dateRange', cached.mouRange);

        // Invalidate progress reports as well. These can just be re-fetched when needed.
        if (eng.__typename === 'LanguageEngagement') {
          invalidateProps(
            cache,
            eng,
            'progressReports',
            'currentProgressReportDue',
            'nextProgressReportDue'
          );
        }
      }
    },
  });
};

export const updatePartnershipsDateRanges = (
  cache: ApolloCache<unknown>,
  project: Project
) => {
  const partnerships = cache.readFragment({
    id: cache.identify(project),
    fragment: ProjectCachedPartnershipDateRangesFragmentDoc,
    fragmentName: 'ProjectCachedPartnershipDateRanges',
  });
  if (!partnerships) {
    return;
  }
  for (const p of partnerships.partnerships.items) {
    updateDateCalcField(cache, p, 'mouRange', partnerships.mouRange);
  }
};

const updateDateCalcField = <Key extends string>(
  cache: ApolloCache<unknown>,
  obj: Partial<Record<Key | `${Key}Override`, SecuredDateRange>>,
  key: Key,
  fromProject: SecuredDateRange | undefined
) => {
  const calc = obj[key];
  const override = obj[`${key}Override` as const];
  if (!fromProject?.canRead || !calc?.canRead || !override?.canRead) {
    console.log('Not enough info to determine which fields need to be updated');
    return;
  }
  if (override.value) {
    return;
  }
  cache.modify({
    id: cache.identify(obj),
    fields: {
      [key]: (() => ({
        ...obj[key],
        value: {
          ...fromProject.value,
          start: override.value?.start ?? fromProject.value?.start,
          end: override.value?.end ?? fromProject.value?.end,
        },
      })) satisfies Modifier<SecuredDateRange>,
    },
  });
};
