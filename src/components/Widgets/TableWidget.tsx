import { Box } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useRef } from 'react';
import {
  ListInput,
  PaginatedListOutput,
  PathsMatching,
  useDataGridSource,
} from '../Grid';
import { GenericWidget } from './GenericWidget';
import { TableWidgetProps } from './widgetConfig';

export const TableWidget = <
  Output extends Record<string, any>,
  Vars,
  Input extends Partial<ListInput>,
  Path extends PathsMatching<Output, PaginatedListOutput<any>> & string
>({
  columns,
  dataGridSourceConfig,
  ...props
}: TableWidgetProps<Output, Vars, Input, Path>) => {
  const [dataGridProps] = useDataGridSource(dataGridSourceConfig);

  const containerRef = useRef<HTMLDivElement>(null);
  const maxHeight = containerRef.current?.clientHeight ?? 300;

  return (
    <GenericWidget {...props} ref={containerRef}>
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
            maxHeight,
          }}
          {...dataGridProps}
        />
      </Box>
    </GenericWidget>
  );
};
