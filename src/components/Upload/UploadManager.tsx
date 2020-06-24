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
import React, { FC } from 'react';
import Draggable from 'react-draggable';
import { UploadState } from './Reducer';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    pointerEvents: 'none',
  },
  paper: {
    pointerEvents: 'auto',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing(1),
  },
  titleButtons: {
    marginLeft: 'auto',
  },
  titleButton: {},
}));

const PaperComponent: FC<PaperProps> = (props) => (
  <Draggable
    handle="#draggable-dialog-title"
    cancel={'[class*="MuiDialogContent-root"]'}
  >
    <Paper {...props} />
  </Draggable>
);

interface DialogTitleProps {
  id: string;
  onClose: () => void;
  onMinimize: () => void;
}

const DialogTitle: FC<DialogTitleProps> = (props) => {
  const { children, id, onClose, onMinimize } = props;
  const classes = useStyles();
  return (
    <MuiDialogTitle
      id={id}
      className={classes.titleContainer}
      disableTypography
    >
      <Typography variant="body2">{children}</Typography>
      <div className={classes.titleButtons}>
        <IconButton aria-label="minimize" onClick={onMinimize} size="small">
          <MinimizeIcon />
        </IconButton>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </div>
    </MuiDialogTitle>
  );
};

interface UploadManagerProps {
  state: UploadState;
}

export const UploadManager: FC<UploadManagerProps> = (props) => {
  const {
    state: { submittedFiles },
  } = props;
  const classes = useStyles();
  console.log('submittedFiles', submittedFiles);
  return (
    <Dialog
      classes={{ root: classes.root, paper: classes.paper }}
      disableBackdropClick
      disableEscapeKeyDown
      hideBackdrop
      open={true}
      onClose={() => console.log('Close')}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        id="draggable-dialog-title"
        onClose={() => console.log('Close')}
        onMinimize={() => console.log('Minimize')}
      >
        Upload Manager
      </DialogTitle>
      <DialogContent>Uploads</DialogContent>
    </Dialog>
  );
};
