import { Box } from '@mui/material';
import { useRef } from 'react';
import { GenericWidget } from './GenericWidget';
import { BaseWidgetProps } from './widgetConfig';

export const BaseWidget = ({ ...props }: BaseWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

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
        {props.children}
      </Box>
    </GenericWidget>
  );
};
