import { useMutation } from '@apollo/client';
import { Box, Button, Typography } from '@mui/material';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import {
  ExecuteGtlReportTransitionDocument,
  type GtlReportDetailFragment,
} from '../Detail/GtlReportDetail.graphql';

/**
 * What a not-yet-started report shows instead of the wizard.
 *
 * Starting is a real workflow transition, not a UI state, so this offers the
 * transition the API says is available rather than assuming one exists.
 */
export const StartGtlReportPage = ({
  report,
}: {
  report: GtlReportDetailFragment;
}) => {
  const [execute, { loading }] = useMutation(
    ExecuteGtlReportTransitionDocument
  );
  const start = report.transitions.find((t) => t.label === 'Start');

  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: 2,
        height: 1,
      }}
    >
      <Typography variant="h2">
        <ReportLabel report={report} /> Report
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480 }}>
        This quarter’s report hasn’t been started yet. Starting it opens the
        sections for the Global Translation Leader, their supervisor and the
        Field Project Manager to fill in.
      </Typography>
      {start ? (
        <Button
          variant="contained"
          size="large"
          disabled={!start.canExecute || loading}
          onClick={() =>
            void execute({
              variables: {
                input: { report: report.id, transition: start.key },
              },
            })
          }
        >
          Start Report
        </Button>
      ) : (
        <Typography variant="body2" color="text.secondary">
          You do not have permission to start this report.
        </Typography>
      )}
    </Box>
  );
};
