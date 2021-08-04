import { useParams } from 'react-router-dom';

export const useReportId = () => {
  const { projectId, reportId, reportType } = useParams();

  return {
    reportUrl: `/projects/${projectId}/reports/${reportType}`,
    projectId,
    reportId,
    reportType,
  };
};
