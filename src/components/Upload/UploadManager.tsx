import {
  Box,
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
import { UploadFile, UploadState } from './Reducer';
import { UploadItem } from './UploadItem';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    pointerEvents: 'none',
  },
  paper: {
    margin: spacing(3),
    pointerEvents: 'auto',
    position: 'absolute',
    bottom: '0px',
    right: '0px',
    width: '480px',
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
  },
  noUploadsText: {
    color: palette.grey[400],
  },
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
      <Typography variant="body1" component="h6" className={classes.title}>
        {children}
      </Typography>
      <div className={classes.titleButtons}>
        <IconButton
          aria-label="minimize"
          className={classes.titleButton}
          onClick={onMinimize}
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

interface UploadManagerProps {
  isOpen: boolean;
  removeUpload: (queueId: UploadFile['queueId']) => void;
  setIsOpen: (isOpen: boolean) => void;
  state: UploadState;
}

export const UploadManager: FC<UploadManagerProps> = (props) => {
  const {
    isOpen,
    removeUpload,
    setIsOpen,
    state: { submittedFiles },
  } = props;
  const areFilesUploading = submittedFiles.length > 0;
  const classes = useStyles();
  return (
    <Dialog
      classes={{ root: classes.root, paper: classes.paper }}
      disableBackdropClick
      disableEscapeKeyDown
      hideBackdrop
      open={isOpen}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        id="draggable-dialog-title"
        onClose={() => setIsOpen(false)}
        onMinimize={() => console.log('Minimize')}
      >
        Upload Manager
      </DialogTitle>
      <DialogContent className={classes.contentContainer}>
        {areFilesUploading ? (
          <>
            {submittedFiles.map((file) => (
              <UploadItem
                key={file.queueId}
                file={file}
                onClear={() => removeUpload(file.queueId)}
              />
            ))}
          </>
        ) : (
          <Box marginTop={-1} p={2} textAlign="center">
            <Typography
              variant="h5"
              component="span"
              className={classes.noUploadsText}
            >
              No uploads
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
