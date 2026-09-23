import {
  Card,
  CardActions,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { GtlReportStatusLabels } from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { FormattedDate } from '../../../components/Formatters';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ButtonLink } from '../../../components/Routing';
import { type InternshipEngagementDetailFragment } from './InternshipEngagement.graphql';

type Report = NonNullable<
  InternshipEngagementDetailFragment['currentGtlReportDue']['value']
>;

/**
 * Quarterly reporting on the Global Translation Leader engagement page.
 *
 * Same shape as Momentum's card: the period currently due and the one after
 * it, a primary action that starts or opens the current report, and a way
 * through to every report. The card is a summary — the list page is where
 * someone goes to find an older quarter.
 */
export const GtlReportsCard = ({
  engagement,
}: {
  engagement: InternshipEngagementDetailFragment;
}) => {
  const current = engagement.currentGtlReportDue.value;
  const next = engagement.nextGtlReportDue.value;
  const progress = engagement.programProgress.value;

  return (
    <Card sx={{ width: 1 }}>
      <CardContent>
        <Typography variant="h4" paragraph>
          Quarterly Reports
        </Typography>

        {!current && !next ? (
          <Typography variant="body2" color="text.secondary">
            No reports yet. They are generated from the engagement’s date range.
          </Typography>
        ) : (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={4}
            sx={{ mb: 1 }}
          >
            {current && <ReportInfo title="Current" report={current} />}
            {next && <ReportInfo title="Next" report={next} />}
          </Stack>
        )}

        {progress != null && (
          <>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Program progress — {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="text.secondary">
              Elapsed time in the program. End date subject to change.
            </Typography>
          </>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between' }}>
        {current &&
          (current.status.value === 'NotStarted' ? (
            <ButtonLink color="primary" to={`/gtl-reports/${current.id}/edit`}>
              Start Report
            </ButtonLink>
          ) : (
            <ButtonLink color="primary" to={`/gtl-reports/${current.id}`}>
              View Report
            </ButtonLink>
          ))}
        <ButtonLink color="primary" to="reports/gtl">
          All Reports
        </ButtonLink>
      </CardActions>
    </Card>
  );
};

const ReportInfo = ({ title, report }: { title: string; report: Report }) => (
  <div>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h4">
      <ReportLabel report={report} />
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Due <FormattedDate date={report.due} />
    </Typography>
    {report.status.value && (
      <Typography variant="body2">
        {labelFrom(GtlReportStatusLabels)(report.status.value)}
      </Typography>
    )}
  </div>
);
