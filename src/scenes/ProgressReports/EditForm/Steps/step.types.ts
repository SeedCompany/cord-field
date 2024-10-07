import { ComponentType } from 'react';
import { Role } from '~/api/schema/schema';
import { ReportProp } from '../ReportProp';

export type StepComponent = ComponentType<ReportProp> & {
  enableWhen?: (prop: ReportProp) => boolean;
  isIncomplete?: IsIncompleteFn;
};

export type IncompleteSeverity = 'required' | 'suggested';

export type IsIncompleteFn = (
  report: ReportProp & { currentUserRoles: ReadonlySet<Role> }
) => {
  isIncomplete: boolean;
  severity: IncompleteSeverity;
};

export type GroupedStepMapShape = {
  [Section in string]: ReadonlyArray<[label: string, component: StepComponent]>;
};

export type GroupedIncompleteSteps = {
  [Section in string]: ReadonlyArray<{
    label: string;
    step: StepComponent;
    severity: IncompleteSeverity;
  }>;
};
