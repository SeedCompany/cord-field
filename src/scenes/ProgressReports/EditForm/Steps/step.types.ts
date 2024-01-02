import { ComponentType } from 'react';
import { Role } from '~/api/schema/schema';
import { ReportProp } from '../ReportProp';

export type StepComponent = ComponentType<ReportProp> & {
  enableWhen?: (prop: ReportProp) => boolean;
  isIncomplete?: IsIncompleteFn;
};

export type IsIncompleteFn = (
  report: ReportProp & { currentUserRoles: ReadonlySet<Role> }
) => boolean;

export type GroupedStepMapShape = {
  [Section in string]: ReadonlyArray<[label: string, component: StepComponent]>;
};
