import { CommunityStoryStep } from './CommunityStory';
import { ExplanationOfProgress } from './ExplanationOfProgress/ExplanationOfProgress';
import { ProgressStep } from './ProgressStep';
import { GroupedStepMapShape } from './step.types';
import { SubmitReportStep } from './SubmitReportStep';
import { TeamNewsStep } from './TeamNews';

export const Steps: GroupedStepMapShape = {
  'Investor Connection': [
    ['Team News', TeamNewsStep],
    ['Story', CommunityStoryStep],
  ],
  'Project Management': [
    ['Progress', ProgressStep],
    ['Explanation of Progress', ExplanationOfProgress],
  ],
  'Final Details': [['Submit Report', SubmitReportStep]],
};

export * from './step.types';
