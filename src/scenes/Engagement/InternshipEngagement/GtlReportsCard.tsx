import { ChevronRight } from '@mui/icons-material';
import {
  Card,
  CardActionArea,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { GtlReportStatusLabels } from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { FormattedDate } from '../../../components/Formatters';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { Link } from '../../../components/Routing';
import { type InternshipEngagementDetailFragment } from './InternshipEngagement.graphql';

/**
 * Quarterly reporting on the Global Translation Leader engagement page.
 *
 * Shows the report that is currently due — the period most recently completed —
 * because that is the one someone lands here to act on. The next period is
 * shown only as context.
 */
export const GtlReportsCard = ({
  engagement,
}: {
  engagement: InternshipEngagementDetailFragment;
}) => {
  const current = engagement.currentGtlReportDue.value;
  const next = engagement.nextGtlReportDue.value;
  const progress = engagement.programProgress.value;
  const report = current ?? next;

  return (
    <Card>
      <CardActionArea
        component={report ? Link : 'div'}
        to={report ? `/gtl-reports/${report.id}` : undefined}
        disabled={!report}
      >
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4">Quarterly Reports</Typography>
            {report && <ChevronRight />}
          </Stack>

          {report ? (
            <>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {current ? 'Currently due' : 'Next period'} —{' '}
                <ReportLabel report={report} />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due <FormattedDate date={report.due} />
                {current?.status.value &&
                  ` · ${labelFrom(GtlReportStatusLabels)(
                    current.status.value
                  )}`}
              </Typography>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No reports yet. They are generated from the engagement’s date
              range.
            </Typography>
          )}

          {progress != null && (
            <>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Program progress — {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </>
          )}

          <Typography variant="caption" color="text.secondary">
            {engagement.gtlReports.total} report
            {engagement.gtlReports.total === 1 ? '' : 's'} in total
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
