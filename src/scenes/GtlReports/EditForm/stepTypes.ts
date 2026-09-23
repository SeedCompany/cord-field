import { type ComponentType } from 'react';
import { type GtlReportDetailFragment } from '../Detail/GtlReportDetail.graphql';

export interface GtlStepProps {
  report: GtlReportDetailFragment;
}

export type GtlStep = ComponentType<GtlStepProps> & {
  /** Hide the step entirely when the API says this section is unreachable. */
  enableWhen?: (report: GtlReportDetailFragment) => boolean;
};

/**
 * The wizard's steps, grouped the way the FY27 narrative report is.
 *
 * Order follows the paper form: look back at last quarter, then forward, then
 * the sections the Global Leader writes, then the FPM's own assessment, then
 * submit. Field Operations is a separate group because everything in it is
 * confidential — grouping makes that visible in the nav rather than only in a
 * caption.
 */
export type GroupedSteps = Record<
  string,
  ReadonlyArray<readonly [label: string, step: GtlStep]>
>;
