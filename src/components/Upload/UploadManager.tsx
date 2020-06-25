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
import { UploadState } from './Reducer';
import { UploadItem } from './UploadItem';

const useStyles = makeStyles(({ spacing }) => ({
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
  setIsOpen: (isOpen: boolean) => void;
  state: UploadState;
}

export const UploadManager: FC<UploadManagerProps> = (props) => {
  const {
    isOpen,
    setIsOpen,
    state: { submittedFiles },
  } = props;
  console.log('submittedFiles', submittedFiles);
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
              <UploadItem key={file.queueId} file={file} />
            ))}
          </>
        ) : (
          <Box
            borderTop={1}
            borderColor="grey.400"
            color="grey.500"
            marginTop={-1}
            p={2}
            textAlign="center"
          >
            <Typography variant="h5" color="inherit" component="span">
              All uploads completed
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
