import { ComponentType } from 'react';
import { ReportProp } from '../ReportProp';

export type StepComponent = ComponentType<ReportProp>;

export type GroupedStepMapShape = {
  [Section in string]: ReadonlyArray<[label: string, component: StepComponent]>;
};
