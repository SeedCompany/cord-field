import { useQuery } from '@apollo/client';
import { Edit } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
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
import { GtlReportStatusLabels } from '~/api/schema/enumLists';
import { labelFrom } from '~/common';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { EngagementBreadcrumb } from '../../../components/EngagementBreadcrumb';
import { Error } from '../../../components/Error';
import { ReportLabel } from '../../../components/PeriodicReports/ReportLabel';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { ButtonLink } from '../../../components/Routing';
import { GtlReportDrawer } from '../EditForm/GtlReportDrawer';
import { GoalsCard } from './GoalsCard';
import { GtlPrayerCard } from './GtlPrayerCard';
import {
  ChangeGtlReportCommunityImpactPromptDocument,
  CreateGtlReportCommunityImpactDocument,
  GtlReportDetailDocument,
  type GtlReportDetailFragment,
  UpdateGtlReportCommunityImpactResponseDocument,
} from './GtlReportDetail.graphql';
import { MediaCard } from './MediaCard';
import { PracticumCard } from './PracticumCard';
import { ProgressExplanationCard } from './ProgressExplanationCard';
import { ProseSection } from './ProseSection';

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

      <Breadcrumbs sx={{ mb: 2 }}>
        <ProjectBreadcrumb data={engagement?.project} />
        <EngagementBreadcrumb data={engagement ?? undefined} />
        <Breadcrumb
          to={
            engagement ? `/engagements/${engagement.id}/reports/gtl` : undefined
          }
        >
          {engagement ? 'Quarterly Reports' : <Skeleton width={160} />}
        </Breadcrumb>
        <Breadcrumb>
          {report ? <ReportLabel report={report} /> : <Skeleton width={80} />}
        </Breadcrumb>
      </Breadcrumbs>

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
          <GoalsCard
            reportId={report.id}
            goals={engagement?.goalSummary.goals ?? []}
            progress={report.goalProgress}
            editable={false}
          />
          <PracticumCard
            reportId={report.id}
            practicums={report.practicums}
            editable={false}
          />
          <ProseSection
            title="Community Impact"
            instructions="Stories, testimonies or incidents from this quarter related to Bible translation and the internship."
            reportId={report.id}
            list={report.communityImpact}
            createDoc={CreateGtlReportCommunityImpactDocument}
            changePromptDoc={ChangeGtlReportCommunityImpactPromptDocument}
            updateResponseDoc={UpdateGtlReportCommunityImpactResponseDocument}
            editable={false}
          />
          <GtlPrayerCard reportId={report.id} editable={false} />
          <MediaCard
            reportId={report.id}
            media={report.media}
            editable={false}
          />
          <ProgressExplanationCard
            reportId={report.id}
            explanation={report.progressExplanation}
            editable={false}
          />
        </Stack>
      )}

      <GtlReportDrawer reportId={reportId} />
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

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <ButtonLink
            variant="contained"
            to={`/gtl-reports/${report.id}/edit`}
            startIcon={<Edit />}
          >
            {report.status.value === 'NotStarted'
              ? 'Start Report'
              : 'Edit Report'}
          </ButtonLink>
        </Stack>

        {report.transitions.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            {/* Links, not actions. Executing from here would silently drop the
                report's "additional comments" — the wizard's submit step owns
                both halves, so there is one place a report moves from. */}
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {report.transitions.map((t) => (
                <ButtonLink
                  key={t.key}
                  size="small"
                  variant={t.type === 'Approve' ? 'contained' : 'outlined'}
                  color={t.type === 'Reject' ? 'error' : 'primary'}
                  disabled={!t.canExecute}
                  to={`/gtl-reports/${report.id}/edit?step=submit-report`}
                >
                  {t.label}
                </ButtonLink>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};
