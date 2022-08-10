import {
  Close as CloseIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
} from '@mui/icons-material';
import { DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useBoolean } from 'ahooks';
import { ReactNode } from 'react';
import { DraggableDialog } from '../Dialog';
import { useSession } from '../Session';

interface UploadManagerProps {
  open: boolean;
  onClose?: () => void;
  children?: ReactNode;
}

export const UploadManagerUIShell = (props: UploadManagerProps) => {
  const { children, open, onClose } = props;
  const { session } = useSession();
  const [isCollapsed, setCollapsed] = useBoolean();
  const [dragging, setDragging] = useBoolean();

  return (
    <DraggableDialog
      disableEnforceFocus
      disableAutoFocus
      hideBackdrop
      open={!!session && open}
      fullWidth
      sx={{ pointerEvents: 'none' }}
      draggableProps={{
        disabled: isCollapsed,
        onStart: setDragging.setTrue,
        onStop: setDragging.setFalse,
      }}
      PaperProps={{
        sx: (theme) => ({
          pointerEvents: 'auto',
          position: 'absolute',
          bottom: 0,
          right: 0,
          maxWidth: 360,
          transition: dragging
            ? undefined
            : theme.transitions.create('transform'),
          ...(isCollapsed ? { transform: 'none !important' } : {}),
        }),
      }}
    >
      <Title
        isCollapsed={isCollapsed}
        onClose={onClose}
        onCollapseClick={setCollapsed.toggle}
      />
      <DialogContent
        sx={{
          p: 1,
          display: isCollapsed ? 'none' : undefined,
        }}
      >
        {children}
      </DialogContent>
    </DraggableDialog>
  );
};

const Title = ({
  isCollapsed,
  onClose,
  onCollapseClick,
}: {
  isCollapsed: boolean;
  onClose?: () => void;
  onCollapseClick?: () => void;
}) => {
  const CollapseIcon = isCollapsed ? MaximizeIcon : MinimizeIcon;
  return (
    <DialogTitle
      variant="body1"
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        pl: 2,
        ...(isCollapsed ? {} : { cursor: 'move' }),
      }}
    >
      <span css={{ flex: 1 }}>Upload Manager</span>
      <IconButton aria-label="minimize" onClick={onCollapseClick} size="small">
        <CollapseIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="close" onClick={onClose} size="small">
        <CloseIcon fontSize="small" />
      </IconButton>
    </DialogTitle>
  );
};
