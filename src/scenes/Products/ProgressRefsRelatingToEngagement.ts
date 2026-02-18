import {
  ApolloCache,
  MutationUpdaterFunction,
  Reference,
} from '@apollo/client';
import { Modifier } from '@apollo/client/cache/core/types/common';
import { uniqBy } from 'lodash';
import { DeepPartial } from 'ts-essentials';
import { readFragment } from '~/api';
import { IdFragment } from '~/common';
import {
  ProgressRefsRelatingToEngagementFragmentDoc as ProgressRefsRelatingToEngagement,
  ProgressReportRefFragment as ProgressReport,
} from './ProgressRefsRelatingToEngagement.graphql';

export const modifyProgressRelatingToEngagement =
  <Res>(
    engagement: IdFragment | undefined,
    action: (
      report: DeepPartial<ProgressReport>,
      result: Res
    ) => Modifier<readonly Reference[]>
  ): MutationUpdaterFunction<Res, unknown, unknown, ApolloCache<unknown>> =>
  (cache, res) => {
    if (!res.data) {
      return;
    }
    const reports = progressRelatingToEngagement(cache, engagement);
    for (const report of reports) {
      cache.modify<ProgressReport>({
        id: cache.identify(report),
        fields: {
          // @ts-expect-error https://github.com/apollographql/apollo-client/pull/12983
          progress: action(report, res.data),
        },
      });
    }
  };

export const progressRelatingToEngagement = (
  cache: ApolloCache<unknown>,
  engagement: IdFragment | undefined
) => {
  const cached = readFragment(cache, {
    object: engagement,
    fragment: ProgressRefsRelatingToEngagement,
    returnPartialData: true,
  });
  const list = [
    ...(cached?.progressReports?.items ?? []),
    cached?.currentProgressReportDue?.value,
    cached?.nextProgressReportDue?.value,
  ].filter(
    (report): report is DeepPartial<ProgressReport> =>
      report?.__typename === 'ProgressReport' && !!report.progress
  );
  return uniqBy(list, (report) => report.id);
};
