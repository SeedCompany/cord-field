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
  Minimize as MinimizeIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React, { FC, memo, useLayoutEffect, useRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { useWindowSize } from 'react-use';
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(1),
  },
  title: {
    paddingLeft: spacing(1),
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

const initialPosition = { x: 0, y: 0 };

const PaperComponent: FC<PaperProps> = ({ ...props }) => {
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 });
  const paperRef = useRef<HTMLDivElement>(null);

  const { width: windowWidth, height: windowHeight } = useWindowSize();

  useLayoutEffect(() => {
    if (paperRef.current) {
      const x =
        windowWidth - paperRef.current.offsetWidth - 24 + initialPosition.x;
      const y =
        windowHeight - paperRef.current.offsetHeight - 24 + initialPosition.y;
      setDefaultPosition({ x, y });
    }
  }, [paperRef, setDefaultPosition, windowHeight, windowWidth]);

  function handleDragStop(_: DraggableEvent, data: DraggableData) {
    const { x, y } = data;
    initialPosition.x = initialPosition.x + x;
    initialPosition.y = initialPosition.y + y;
  }

  return (
    <Draggable
      cancel={'[class*="MuiDialogContent-root"]'}
      handle="#draggable-dialog-title"
      positionOffset={defaultPosition}
      onStop={handleDragStop}
    >
      <Paper ref={paperRef} {...props} />
    </Draggable>
  );
};

interface DialogTitleProps {
  id: string;
  onClose: () => void;
  onCollapseClick: () => void;
}

const DialogTitle: FC<DialogTitleProps> = (props) => {
  const { children, id, onClose, onCollapseClick } = props;
  const classes = useStyles();
  return (
    <MuiDialogTitle
      id={id}
      className={classes.titleContainer}
      disableTypography
    >
      <Typography variant="body1" component="h6" className={classes.title}>
        {children}
      </Typography>
      <div className={classes.titleButtons}>
        <IconButton
          aria-label="minimize"
          className={classes.titleButton}
          onClick={onCollapseClick}
          size="small"
        >
          <MinimizeIcon fontSize="small" />
        </IconButton>
        <IconButton
          aria-label="close"
          className={classes.titleButton}
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
  const { isManagerOpen, setIsManagerOpen } = useUploadManager();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const classes = useStyles();
  return (
    <Dialog
      classes={{ root: classes.root, paper: classes.paper }}
      disableBackdropClick
      disableEscapeKeyDown
      hideBackdrop
      open={isManagerOpen}
      PaperComponent={(props) => <PaperComponent {...props} />}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        id="draggable-dialog-title"
        onClose={() => setIsManagerOpen(false)}
        onCollapseClick={() => setIsCollapsed((isCollapsed) => !isCollapsed)}
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
