import { Card, SxProps } from '@mui/material';
import { ChildrenProp, extendSx } from '~/common';

export interface WidgetProps extends ChildrenProp {
  colSpan?: number;
  rowSpan?: number;
  sx?: SxProps;
}

export const Widget = ({ colSpan, rowSpan, sx, ...props }: WidgetProps) => {
  return (
    <Card
      elevation={0}
      variant="outlined"
      sx={[
        {
          gridColumn: `span ${colSpan}`,
          gridRow: `span ${rowSpan}`,
        },
        ...extendSx(sx),
      ]}
    >
      {props.children}
    </Card>
  );
};
