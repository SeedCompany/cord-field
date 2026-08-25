import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import {
  GtlProgressStatusLabels,
  GtlReportStatusLabels,
} from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { Error } from '../../../components/Error';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { RichTextView } from '../../../components/RichText';
import {
  ExecuteGtlReportTransitionDocument,
  GtlReportDetailDocument,
  type GtlReportDetailFragment,
} from './GtlReportDetail.graphql';

/**
 * The GTL quarterly narrative report.
 *
 * Read-first by design: the sections a Global Translation Leader fills in are
 * shown together so an FPM can review the quarter in one pass, with the
 * workflow actions that move the report at the top.
 */
export const GtlReportDetail = () => {
  const { reportId = '' } = useParams();
  const { data, loading, error } = useQuery(GtlReportDetailDocument, {
    variables: { id: reportId },
  });

  const report =
    data?.periodicReport.__typename === 'GTLReport'
      ? (data.periodicReport as GtlReportDetailFragment)
      : null;

  if (error) {
    return <Error error={error}>Could not load this report</Error>;
  }
  if (!loading && data && !report) {
    return <Error show>This is not a Global Translation Leader report</Error>;
  }

  const engagement =
    report?.parent.__typename === 'InternshipEngagement' ? report.parent : null;

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', p: 4, maxWidth: 900 }}>
      <Helmet
        title={`Quarterly Report — ${
          engagement?.intern.value?.fullName ?? 'Global Translation Leader'
        }`}
      />

      <Typography variant="h2" paragraph>
        {loading ? (
          <Skeleton width="16ch" />
        ) : (
          <>
            Global Translation Leader Report
            {report && (
              <>
                {' — '}
                <ReportLabel report={report} />
              </>
            )}
          </>
        )}
      </Typography>

      {loading || !report ? (
        <Skeleton variant="rectangular" height={280} />
      ) : (
        <Stack spacing={3}>
          <HeaderCard report={report} engagement={engagement} />
          <GoalsCard report={report} />
          <PracticumCard report={report} />
          <ProseCard title="Community Impact" list={report.communityImpact} />
          <ProseCard title="Praises" list={report.praises} />
          <ProseCard title="Prayer Requests" list={report.petitions} />
          <ProgressExplanationCard report={report} />
        </Stack>
      )}
    </Box>
  );
};

const HeaderCard = ({
  report,
  engagement,
}: {
  report: GtlReportDetailFragment;
  engagement: Extract<
    GtlReportDetailFragment['parent'],
    { __typename?: 'InternshipEngagement' }
  > | null;
}) => {
  const [execute, { loading }] = useMutation(
    ExecuteGtlReportTransitionDocument
  );
  const progress = engagement?.programProgress.value ?? null;

  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Typography variant="h4">
            {engagement?.intern.value?.fullName ?? 'Global Translation Leader'}
          </Typography>
          {report.status.value && (
            <Chip
              label={labelFrom(GtlReportStatusLabels)(report.status.value)}
              color="primary"
              variant="outlined"
            />
          )}
        </Stack>

        {engagement?.project.name.value && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {engagement.project.name.value}
          </Typography>
        )}

        {progress != null && (
          <Box sx={{ mt: 2, maxWidth: 380 }}>
            <Typography variant="body2" gutterBottom>
              Program progress — {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="caption" color="text.secondary">
              Elapsed time in the program. End date subject to change.
            </Typography>
          </Box>
        )}

        {report.transitions.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {report.transitions.map((t) => (
                <Button
                  key={t.key}
                  size="small"
                  variant={t.type === 'Approve' ? 'contained' : 'outlined'}
                  color={t.type === 'Reject' ? 'error' : 'primary'}
                  disabled={!t.canExecute || loading}
                  onClick={() =>
                    void execute({
                      variables: {
                        input: { report: report.id, transition: t.key },
                      },
                    })
                  }
                >
                  {t.label}
                </Button>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const GoalsCard = ({ report }: { report: GtlReportDetailFragment }) => (
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Goals
      </Typography>

      <Typography variant="overline" color="text.secondary">
        From the previous quarter
      </Typography>
      {report.previousQuarterGoals.length === 0 ? (
        <Empty>No goals were carried forward into this quarter.</Empty>
      ) : (
        report.previousQuarterGoals.map((g) => (
          <Box key={g.id} sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body1">{g.goal.value}</Typography>
              <Chip
                size="small"
                label={g.met.value ? 'Met' : 'Not met'}
                color={g.met.value ? 'success' : 'default'}
              />
            </Stack>
            {g.impact.value && <RichTextView data={g.impact.value} />}
          </Box>
        ))
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="overline" color="text.secondary">
        Set for next quarter
      </Typography>
      {report.goals.length === 0 ? (
        <Empty>No goals set yet.</Empty>
      ) : (
        report.goals.map((g) => (
          <Box key={g.id} sx={{ mb: 2 }}>
            <Typography variant="body1">{g.goal.value}</Typography>
            {g.details.value && <RichTextView data={g.details.value} />}
          </Box>
        ))
      )}
    </CardContent>
  </Card>
);

const PracticumCard = ({ report }: { report: GtlReportDetailFragment }) => (
  <Card>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        Practicum &amp; Workshop Involvement
      </Typography>
      {report.practicums.length === 0 ? (
        <Empty>Nothing reported this quarter.</Empty>
      ) : (
        report.practicums.map((p) => (
          <Box key={p.id} sx={{ mb: 2 }}>
            <Typography variant="body1">{p.involvement.value}</Typography>
            {p.mentor.value && (
              <Typography variant="caption" color="text.secondary">
                with {p.mentor.value.fullName}
              </Typography>
            )}
            {p.outcomes.value && <RichTextView data={p.outcomes.value} />}
          </Box>
        ))
      )}
    </CardContent>
  </Card>
);

const ProseCard = ({
  title,
  list,
}: {
  title: string;
  list: GtlReportDetailFragment['communityImpact'];
}) => {
  if (!list.canRead) return null;
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        {list.items.length === 0 ? (
          <Empty>Nothing written yet.</Empty>
        ) : (
          list.items.map((item) => (
            <Box key={item.id} sx={{ mb: 2 }}>
              {item.prompt.value?.shortLabel.value && (
                <Typography variant="overline" color="text.secondary">
                  {item.prompt.value.shortLabel.value}
                </Typography>
              )}
              {item.responses
                .filter((r) => r.response.value)
                .map((r) => (
                  <Box key={r.variant.key} sx={{ mb: 1 }}>
                    <Chip size="small" label={r.variant.label} sx={{ mr: 1 }} />
                    <RichTextView data={r.response.value} />
                  </Box>
                ))}
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

/** Field Operations only — the API redacts it for everyone else. */
const ProgressExplanationCard = ({
  report,
}: {
  report: GtlReportDetailFragment;
}) => {
  const { status, context } = report.progressExplanation;
  if (!status.canRead) return null;
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Explanation of Progress
        </Typography>
        <Typography variant="caption" color="text.secondary" paragraph>
          Completed by the Field Project Manager. Not shared outside Field
          Operations.
        </Typography>
        {status.value ? (
          <>
            <Chip label={labelFrom(GtlProgressStatusLabels)(status.value)} />
            {context.value && <RichTextView data={context.value} />}
          </>
        ) : (
          <Empty>Not yet assessed.</Empty>
        )}
      </CardContent>
    </Card>
  );
};

const Empty = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" color="text.secondary" paragraph>
    {children}
  </Typography>
);
