import {
  ApolloCache,
  MutationUpdaterFunction,
  Reference,
} from '@apollo/client';
import { Modifier } from '@apollo/client/cache/core/types/common';
import { uniqBy } from 'lodash';
import { DeepPartial } from 'ts-essentials';
import { IdFragment, readFragment } from '../../api';
import {
  ProgressRefsRelatingToEngagementFragmentDoc as ProgressRefsRelatingToEngagement,
  ProgressReportRefFragment as ProgressReport,
} from './ProgressRefsRelatingToEngagement.generated';

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
      cache.modify({
        id: cache.identify(report),
        fields: { progress: action(report, res.data) },
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
