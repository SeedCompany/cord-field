import { Box } from '@mui/material';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useRef } from 'react';
import { GenericWidget } from './GenericWidget';
import { TableWidgetProps } from './widgetConfig';

export const TableWidget = ({
  columns,
  dataGridProps,
  ...props
}: TableWidgetProps) => {
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
          {...dataGridProps}
          density="compact"
          columns={columns}
          sx={{
            '--unstable_DataGrid-radius': '0px',
            border: 'none',
            maxHeight,
          }}
        />
      </Box>
    </GenericWidget>
  );
};
