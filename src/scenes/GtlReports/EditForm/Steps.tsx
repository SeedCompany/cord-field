import { GoalsCard } from '../Detail/GoalsCard';
import { GtlPrayerCard } from '../Detail/GtlPrayerCard';
import {
  ChangeGtlReportCommunityImpactPromptDocument,
  CreateGtlReportCommunityImpactDocument,
  UpdateGtlReportCommunityImpactResponseDocument,
} from '../Detail/GtlReportDetail.graphql';
import { MediaCard } from '../Detail/MediaCard';
import { PracticumCard } from '../Detail/PracticumCard';
import { ProgressExplanationCard } from '../Detail/ProgressExplanationCard';
import { ProseSection } from '../Detail/ProseSection';
import { type GroupedSteps, type GtlStepProps } from './stepTypes';
import { SubmitStep } from './SubmitStep';

const GoalsStep = ({ report }: GtlStepProps) => {
  // A GTL report only ever hangs off an internship engagement, so the parent is
  // already narrowed here — no __typename check to make.
  const engagement = report.parent;
  return (
    <GoalsCard
      reportId={report.id}
      engagementId={engagement.id}
      goals={engagement.goalSummary.goals}
      progress={report.goalProgress}
    />
  );
};

const PracticumStep = ({ report }: GtlStepProps) => (
  <PracticumCard reportId={report.id} practicums={report.practicums} />
);

const CommunityImpactStep = ({ report }: GtlStepProps) => (
  <ProseSection
    title="Community Impact"
    instructions="Stories, testimonies or incidents from this quarter related to Bible translation and the internship."
    reportId={report.id}
    list={report.communityImpact}
    createDoc={CreateGtlReportCommunityImpactDocument}
    changePromptDoc={ChangeGtlReportCommunityImpactPromptDocument}
    updateResponseDoc={UpdateGtlReportCommunityImpactResponseDocument}
  />
);
CommunityImpactStep.enableWhen = (report: GtlStepProps['report']) =>
  report.communityImpact.canRead;

const PrayerStep = ({ report }: GtlStepProps) => (
  <GtlPrayerCard reportId={report.id} />
);

const MediaStep = ({ report }: GtlStepProps) => (
  <MediaCard reportId={report.id} media={report.media} />
);

const ExplanationStep = ({ report }: GtlStepProps) => (
  <ProgressExplanationCard
    reportId={report.id}
    explanation={report.progressExplanation}
  />
);
// Field Operations only — the API decides, and the step disappears entirely
// rather than rendering an empty card for everyone else.
ExplanationStep.enableWhen = (report: GtlStepProps['report']) =>
  report.progressExplanation.status.canRead;

export const GtlSteps: GroupedSteps = {
  'The Quarter': [
    ['Goals', GoalsStep],
    ['Practicum', PracticumStep],
  ],
  'Investor Connection': [
    ['Community Impact', CommunityImpactStep],
    ['Prayer', PrayerStep],
    ['Photos & Video', MediaStep],
  ],
  'Field Operations': [['Explanation of Progress', ExplanationStep]],
  'Final Details': [['Submit Report', SubmitStep]],
};
