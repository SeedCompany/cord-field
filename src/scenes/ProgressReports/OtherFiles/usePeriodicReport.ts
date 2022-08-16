import { useQuery } from '@apollo/client';
import { PeriodicReportDocument } from './OtherFiles.graphql';
import { useReportId } from './useReportId';

export const usePeriodicReport = () => {
  const { reportId } = useReportId();

  const { data, loading } = useQuery(PeriodicReportDocument, {
    variables: {
      reportId,
    },
  });

  const report = data?.periodicReport;
  const reportDirectoryId = report?.otherFiles.value?.id || '';
  const reportsUrl = `/engagements/${report?.parent.id}/reports/progress` || '';
  const reportIntervalUrl = `/progress-reports/${report?.id}` || '';

  return { report, loading, reportDirectoryId, reportsUrl, reportIntervalUrl };
};
