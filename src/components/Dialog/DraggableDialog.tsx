import { Dialog, DialogProps } from '@mui/material';
import { DraggableProps } from 'react-draggable';
import { DraggablePaper, DraggablePaperProps } from '../DraggablePaper';

export interface DraggableDialogProps
  extends Omit<DialogProps, 'PaperComponent'> {
  draggableProps?: Partial<DraggableProps>;
}

export const DraggableDialog = (props: DraggableDialogProps) => {
  const paperProps: DraggablePaperProps = {
    ...props.PaperProps,
    draggableProps: {
      bounds: 'parent',
      handle: '.MuiDialogTitle-root',
      ...props.draggableProps,
    },
  };
  return (
    <Dialog {...props} PaperComponent={DraggablePaper} PaperProps={paperProps}>
      {props.children}
    </Dialog>
  );
};
