import { ComponentType } from 'react';
import { ReportProp } from '../ReportProp';

export type StepComponent = ComponentType<ReportProp> & {
  enableWhen?: (prop: ReportProp) => boolean;
};

export type GroupedStepMapShape = {
  [Section in string]: ReadonlyArray<[label: string, component: StepComponent]>;
};
