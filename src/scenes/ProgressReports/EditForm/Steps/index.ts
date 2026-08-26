import { CommunityStoryStep } from './CommunityStory';
import { ExplanationOfProgress } from './ExplanationOfProgress/ExplanationOfProgress';
import { MediaStep } from './Media';
import { NextQuarterPlansStep } from './NextQuarterPlans';
import { OtherActivitiesStep } from './OtherActivities';
import { ProgressStep } from './ProgressStep';
import { GroupedStepMapShape } from './step.types';
import { SubmitReportStep } from './SubmitReportStep';
import { TeamNewsStep } from './TeamNews';

export const Steps: GroupedStepMapShape = {
  'Investor Connection': [
    ['Team News', TeamNewsStep],
    ['Story', CommunityStoryStep],
    ['Media', MediaStep],
  ],
  // Neither investor storytelling nor Seed Company's internal progress
  // assessment — this is the partner's account of the quarter, which is why it
  // gets its own group between the two rather than being folded into either.
  'Quarter in Review': [
    ['Other Activities', OtherActivitiesStep],
    ['Next Quarter', NextQuarterPlansStep],
  ],
  'Project Management': [
    ['Progress', ProgressStep],
    ['Explanation of Progress', ExplanationOfProgress],
  ],
  'Final Details': [['Submit Report', SubmitReportStep]],
};

export * from './step.types';
