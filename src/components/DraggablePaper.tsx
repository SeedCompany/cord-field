import { Paper, PaperProps } from '@mui/material';
import Draggable, { DraggableProps } from 'react-draggable';

export type DraggablePaperProps = PaperProps & {
  draggableProps?: Partial<DraggableProps>;
};

export const DraggablePaper = ({
  draggableProps,
  ...rest
}: DraggablePaperProps) => (
  <Draggable {...draggableProps}>
    <Paper {...rest} />
  </Draggable>
);
