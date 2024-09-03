import { Box } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import {
  ListInput,
  PaginatedListOutput,
  PathsMatching,
  useDataGridSource,
} from '../Grid';
import { DashboardWidget } from './DashboardWidget';
import { WidgetConfigProps } from './widgetConfig';

export const TableWidget = <
  Output extends Record<string, any>,
  Vars,
  Input extends Partial<ListInput>,
  Path extends PathsMatching<Output, PaginatedListOutput<any>> & string
>({
  title,
  subTitle,
  columns,
  dataGridSourceConfig,
  colSpan,
  rowSpan,
  key,
  CardProps,
}: WidgetConfigProps<Output, Vars, Input, Path>) => {
  const [dataGridProps] = useDataGridSource(dataGridSourceConfig);

  return (
    <DashboardWidget
      colSpan={colSpan}
      rowSpan={rowSpan}
      title={title}
      subTitle={subTitle}
      to="partners"
      key={key}
      CardProps={CardProps}
    >
      <Box
        sx={({ spacing }) => ({
          height: '100%',
          width: `calc(100% - ${spacing(4)})`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        })}
      >
        <DataGridPro
          density="compact"
          columns={columns}
          sx={{
            '--unstable_DataGrid-radius': '0px',
            border: 'none',
          }}
          {...dataGridProps}
        />
      </Box>
    </DashboardWidget>
  );
};
