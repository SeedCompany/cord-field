import { ComponentType } from 'react';
import { ReportProp } from '../ReportProp';
import { CommunityStoryStep } from './CommunityStory';
import { ExplanationOfProgress } from './ExplanationOfProgress/ExplanationOfProgress';
import { ProgressStep } from './ProgressStep';
import { SubmitReportStep } from './SubmitReportStep';
import { TeamNewsStep } from './TeamNews';

export const Steps: {
  [Section in string]: ReadonlyArray<
    [label: string, component: ComponentType<ReportProp>]
  >;
} = {
  'Narrative Report': [
    ['Team News', TeamNewsStep],
    ['Community Story', CommunityStoryStep],
  ],
  'Project Management': [
    ['Progress', ProgressStep],
    ['Explanation of Progress', ExplanationOfProgress],
  ],
  'Final Details': [['Submit Report', SubmitReportStep]],
};
