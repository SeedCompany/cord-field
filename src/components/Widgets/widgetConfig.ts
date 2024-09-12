import { DataGridProProps as DataGridProps } from '@mui/x-data-grid-pro';
import { ElementType } from 'react';
import { GenericWidgetProps } from './GenericWidget';
import { MOUStartWidget } from './MOUStart/MOUStartWidget';

export type TableWidgetProps = GenericWidgetProps & {
  type: 'TableWidget';
  columns: any[];
  dataGridProps: Partial<DataGridProps>;
};

export type BaseWidgetProps = GenericWidgetProps & {
  type: 'BaseWidget';
};

export type WidgetConfigProps = BaseWidgetProps | TableWidgetProps;

export const widgetConfigs: ElementType[] = [MOUStartWidget];
