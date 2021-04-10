import { ApolloCache } from '@apollo/client';
import { DeepPartial } from 'ts-essentials';
import { Project as ProjectShape, SecuredProp } from '../../../api';
import { CalendarDate } from '../../../util';
import {
  ProjectCachedEngagementDateRangesFragmentDoc,
  ProjectCachedPartnershipDateRangesFragmentDoc,
} from './CachedProjectDateRanges.generated';

type Project = Pick<ProjectShape, 'id'>;
type SecuredDate = DeepPartial<
  Pick<SecuredProp<CalendarDate>, 'value' | 'canRead'>
>;

export const updateEngagementDateRanges = (
  cache: ApolloCache<unknown>,
  project: Project
) => {
  const cached = cache.readFragment({
    id: cache.identify(project),
    fragment: ProjectCachedEngagementDateRangesFragmentDoc,
    // We need override fields here but the engagement list doesn't have them.
    // If the user visits/caches one of the engagements we need to update that one
    // But without partial data, Apollo will correctly say that not all engagements
    // fulfill the shape requested and thus return null.
    // We want to allow some engagements to be missing data, and we'll account
    // for that in our update logic.
    returnPartialData: true,
  });
  if (!cached) {
    return;
  }
  for (const eng of (cached as DeepPartial<typeof cached>).engagements?.items ??
    []) {
    if (!eng) {
      continue;
    }
    updateDateCalcField(cache, eng, 'startDate', cached.mouStart);
    updateDateCalcField(cache, eng, 'endDate', cached.mouEnd);
  }
};

export const updatePartnershipsDateRanges = (
  cache: ApolloCache<unknown>,
  project: Project
) => {
  const partnerships = cache.readFragment({
    id: cache.identify(project),
    fragment: ProjectCachedPartnershipDateRangesFragmentDoc,
  });
  if (!partnerships) {
    return;
  }
  for (const p of partnerships.partnerships.items) {
    updateDateCalcField(cache, p, 'mouStart', partnerships.mouStart);
    updateDateCalcField(cache, p, 'mouEnd', partnerships.mouEnd);
  }
};

const updateDateCalcField = <Key extends string>(
  cache: ApolloCache<unknown>,
  obj: Partial<Record<Key | `${Key}Override`, SecuredDate>>,
  key: Key,
  fromProject: SecuredDate
) => {
  const calc = obj[key];
  const override = obj[`${key}Override` as const];
  if (!fromProject.canRead || !calc?.canRead || !override?.canRead) {
    console.log('Not enough info to determine which fields need to be updated');
    return;
  }
  if (override.value) {
    return;
  }
  cache.modify({
    id: cache.identify(obj),
    fields: {
      [key]: () => ({
        ...obj[key],
        value: fromProject.value,
      }),
    },
  });
};
