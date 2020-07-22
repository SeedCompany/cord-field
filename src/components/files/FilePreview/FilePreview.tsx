import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { FC } from 'react';
import { File } from '../../../api';

interface FilePreviewProps {
  file?: File;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

export const FilePreview: FC<FilePreviewProps> = (props) => {
  const { file, onClose, ...rest } = props;
  const { name, downloadUrl } = file ?? { name: '', downloadUrl: '' };
  return (
    <Dialog onClose={onClose} {...rest} aria-labelledby="dialog-file-preview">
      <DialogTitle id="dialog-file-preview">{name}</DialogTitle>
      <DialogContent>
        <iframe title={`${name} file preview`} src={downloadUrl} />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
