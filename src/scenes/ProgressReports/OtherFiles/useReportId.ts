import { useParams } from 'react-router-dom';

export const useReportId = () => {
  const { reportId = '' } = useParams();

  return {
    reportUrl: `/progress-reports/${reportId}`,
    reportId,
  };
};
