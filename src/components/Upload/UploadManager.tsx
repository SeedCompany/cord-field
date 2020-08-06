import {
  Dialog,
  DialogContent,
  IconButton,
  makeStyles,
  DialogTitle as MuiDialogTitle,
  Typography,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
} from '@material-ui/icons';
import clsx from 'clsx';
import React, { FC, memo, useState } from 'react';
import { useSession } from '../Session';
import { DraggablePaper } from './DraggablePaper';
import { useUploadManager } from './UploadManagerContext';

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
    width: PAPER_WIDTH,
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
        <DraggablePaper {...props} isCollapsed={isCollapsed} />
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
