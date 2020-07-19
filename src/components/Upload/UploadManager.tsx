import {
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  DialogTitle as MuiDialogTitle,
  Paper,
  PaperProps,
  Typography,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React, {
  FC,
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useWindowSize } from 'react-use';
import { useSession } from '../Session';
import { useUploadManager } from './UploadContext';

const PAPER_WIDTH = 480;

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    pointerEvents: 'none',
  },
  paper: {
    margin: 0,
    pointerEvents: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${PAPER_WIDTH}px`,
  },
  titleContainer: {
    cursor: 'move',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(1),
    '&.collapsed': {
      cursor: 'default',
    },
  },
  title: {
    cursor: 'move',
    paddingLeft: spacing(1),
    '&.collapsed': {
      cursor: 'default',
    },
  },
  titleButtons: {
    marginLeft: 'auto',
  },
  titleButton: {},
  contentContainer: {
    padding: spacing(1),
    '&.collapsed': {
      display: 'none',
    },
  },
  noUploadsText: {
    color: palette.grey[400],
  },
}));

const initialPosition = { x: null as null | number, y: null as null | number };

const PaperComponent: FC<PaperProps & { isCollapsed: boolean }> = ({
  ...props
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const paperRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(initialPosition);
  const { isCollapsed, ...rest } = props;

  const { width: windowWidth, height: windowHeight } = useWindowSize();
  const managerSize = {
    width: (paperRef.current?.offsetWidth ?? 0) + 24,
    height: (paperRef.current?.offsetHeight ?? 0) + 24,
  };
  const collapsedPosition = {
    x: windowWidth - managerSize.width,
    y: windowHeight - managerSize.height,
  };

  const calculatePosition = useCallback(() => {
    const x =
      positionRef.current.x ??
      windowWidth - (paperRef.current?.offsetWidth ?? 0) - 24;
    const y =
      positionRef.current.y ??
      windowHeight - (paperRef.current?.offsetHeight ?? 0) - 24;
    return { x, y };
  }, [windowWidth, windowHeight, paperRef, positionRef]);

  useLayoutEffect(() => {
    const { x, y } = calculatePosition();
    setPosition({ x, y });
  }, [calculatePosition, setPosition]);

  function handleDrag() {
    setIsDragging(true);
  }

  function handleDragStop(_: DraggableEvent, data: DraggableData) {
    const wasDragging = isDragging;
    setIsDragging(false);
    if (wasDragging) {
      const { x, y } = data;
      positionRef.current.x = x;
      positionRef.current.y = y;
      setPosition({ x, y });
    }
  }

  return (
    <Draggable
      bounds="parent"
      cancel="#upload-manager-collapse-button, #upload-manager-close-button"
      disabled={isCollapsed}
      handle="#draggable-dialog-title"
      onDrag={handleDrag}
      onStop={handleDragStop}
      position={isCollapsed ? collapsedPosition : position}
    >
      <Paper ref={paperRef} {...rest} />
    </Draggable>
  );
};

interface DialogTitleProps {
  id: string;
  isCollapsed: boolean;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onCollapseClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const DialogTitle: FC<DialogTitleProps> = (props) => {
  const { children, id, isCollapsed, onClose, onCollapseClick } = props;
  const classes = useStyles();
  const IconComponent = isCollapsed ? MaximizeIcon : MinimizeIcon;
  return (
    <MuiDialogTitle
      id={id}
      className={clsx(classes.titleContainer, isCollapsed && 'collapsed')}
      disableTypography
    >
      <Typography
        variant="body1"
        component="h6"
        className={clsx(classes.title, isCollapsed && 'collapsed')}
      >
        {children}
      </Typography>
      <div className={classes.titleButtons}>
        <IconButton
          aria-label="minimize"
          className={classes.titleButton}
          id="upload-manager-collapse-button"
          onClick={onCollapseClick}
          size="small"
        >
          <IconComponent fontSize="small" />
        </IconButton>
        <IconButton
          aria-label="close"
          className={classes.titleButton}
          id="upload-manager-close-button"
          onClick={onClose}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
    </MuiDialogTitle>
  );
};

export const UploadManager: FC = memo((props) => {
  const { children } = props;
  const [session] = useSession();
  const { isManagerOpen, setIsManagerOpen } = useUploadManager();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const classes = useStyles();

  function handleClose(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsManagerOpen(false);
  }

  function handleCollapse(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    console.log('Changing collapsed');
    setIsCollapsed((isCollapsed) => !isCollapsed);
  }

  return (
    <Dialog
      classes={{ root: classes.root, paper: classes.paper }}
      disableBackdropClick
      disableEscapeKeyDown
      hideBackdrop
      open={!!session && isManagerOpen}
      PaperComponent={(props) => (
        <PaperComponent {...props} isCollapsed={isCollapsed} />
      )}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        id="draggable-dialog-title"
        isCollapsed={isCollapsed}
        onClose={handleClose}
        onCollapseClick={handleCollapse}
      >
        Upload Manager
      </DialogTitle>
      <DialogContent
        className={clsx(classes.contentContainer, isCollapsed && 'collapsed')}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
});
