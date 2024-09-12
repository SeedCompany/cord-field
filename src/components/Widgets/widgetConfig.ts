import {
  ListInput,
  PaginatedListOutput,
  PathsMatching,
  UseDataGridSourceParams,
} from '../Grid';
import { DashboardWidgetProps } from './GenericWidget';
import { MOUEndWidgetConfig } from './MOUEnd/MOUEndWidget';
import { MOUStartWidgetConfig } from './MOUStart/MOUStartWidget';
import { SideWidgetConfig } from './SidePanel/SidePanel';

export type TableWidgetProps<
  Output extends Record<string, any>,
  Vars,
  Input extends Partial<ListInput>,
  Path extends PathsMatching<Output, PaginatedListOutput<any>> & string
> = DashboardWidgetProps & {
  type: 'TableWidget';
  columns: any[];
  dataGridSourceConfig: UseDataGridSourceParams<Output, Vars, Input, Path>;
};

export type BaseWidgetProps = DashboardWidgetProps & {
  type: 'BaseWidget';
};

export type WidgetConfigProps<
  Output extends Record<string, any>,
  Vars,
  Input extends Partial<ListInput>,
  Path extends PathsMatching<Output, PaginatedListOutput<any>> & string
> = BaseWidgetProps | TableWidgetProps<Output, Vars, Input, Path>;

interface OutputType {
  engagements: any;
}

interface VarsType {
  [k: string]: any;
}

type InputType = Partial<ListInput>;

type PathType = 'engagements';

export type WidgetConfig = WidgetConfigProps<
  OutputType,
  VarsType,
  InputType,
  PathType
>;

export const widgetConfigs: WidgetConfig[] = [
  MOUStartWidgetConfig,
  SideWidgetConfig,
  MOUEndWidgetConfig,
];
