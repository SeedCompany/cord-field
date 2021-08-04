import { useQuery } from '@apollo/client';
import { ProjectReportDocument } from './ReportFiles.generated';
import { useReportId } from './useReportId';

export const useProjectReport = () => {
  const { projectId, reportId, reportType } = useReportId();

  const { data, loading } = useQuery(ProjectReportDocument, {
    variables: {
      projectId,
      reportId,
    },
  });

  const project = data?.project;
  const report = data?.periodicReport;
  const reportDirectoryId = report?.reportDirectory.value?.id || '';
  const reportsUrl = `/projects/${projectId}/reports/${reportType}`;

  return { project, report, loading, reportDirectoryId, reportsUrl };
};
