import {
  ApolloCache,
  MutationUpdaterFunction,
  Reference,
} from '@apollo/client';
import { Modifier } from '@apollo/client/cache/core/types/common';
import { IdFragment, readFragment } from '../../api';
import { ProgressRefsRelatingToEngagementFragmentDoc as ProgressRefsRelatingToEngagement } from './ProgressRefsRelatingToEngagement.generated';

export const modifyProgressRelatingToEngagement =
  <Res>(
    engagement: IdFragment | undefined,
    action: Modifier<readonly Reference[]>
  ): MutationUpdaterFunction<Res, unknown, unknown, ApolloCache<unknown>> =>
  (cache) => {
    const cached = readFragment(cache, {
      object: engagement,
      fragment: ProgressRefsRelatingToEngagement,
      returnPartialData: true,
    });
    const reports = [
      ...(cached?.progressReports?.items ?? []),
      cached?.currentProgressReportDue?.value,
      cached?.nextProgressReportDue?.value,
    ];
    for (const report of reports) {
      if (report?.__typename === 'ProgressReport') {
        cache.modify({
          id: cache.identify(report),
          fields: { progress: action },
        });
      }
    }
  };
