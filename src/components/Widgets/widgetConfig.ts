import { CardProps } from '@mui/material';
import { EngagementListDocument } from '~/scenes/Projects/List/EngagementList.graphql';
import {
  ListInput,
  PaginatedListOutput,
  PathsMatching,
  UseDataGridSourceParams,
} from '../Grid';
import { MOUStartColumns } from './MOUStart/MOUStartWidget';

export interface WidgetConfigProps<
  Output extends Record<string, any>,
  Vars,
  Input extends Partial<ListInput>,
  Path extends PathsMatching<Output, PaginatedListOutput<any>> & string
> {
  type: string;
  title: string;
  subTitle: string;
  columns: any[];
  dataGridSourceConfig: UseDataGridSourceParams<Output, Vars, Input, Path>;
  colSpan: number;
  rowSpan: number;
  key: string;
  CardProps?: CardProps;
}

interface OutputType {
  engagements: any;
}

interface VarsType {
  [k: string]: any;
}

type InputType = Partial<ListInput>;

type PathType = 'engagements';

export const widgetConfigs: Array<
  WidgetConfigProps<OutputType, VarsType, InputType, PathType>
> = [
  {
    type: 'TableWidget',
    title: 'Projects Starting Soon',
    subTitle: 'Projects in development starting in the next 30, 60, or 90 days',
    columns: MOUStartColumns,
    dataGridSourceConfig: {
      query: EngagementListDocument,
      variables: {},
      listAt: 'engagements',
      initialInput: {
        sort: MOUStartColumns[0]!.field,
      },
    },
    colSpan: 8,
    rowSpan: 6,
    key: 'table1',
    CardProps: { sx: { p: 0 } },
  },
];
