import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { FC } from 'react';
import { File } from '../../../api';
import { PdfPreview } from './PdfPreview';

interface FilePreviewProps {
  file?: File;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

const previewers = {
  'application/pdf': PdfPreview,
};

export const FilePreview: FC<FilePreviewProps> = (props) => {
  const { file, onClose, ...rest } = props;
  const { downloadUrl, mimeType, name } = file ?? {
    downloadUrl: '',
    mimeType: '',
    name: '',
  };
  const Previewer = previewers[mimeType as keyof typeof previewers];
  return (
    <Dialog onClose={onClose} {...rest} aria-labelledby="dialog-file-preview">
      <DialogTitle id="dialog-file-preview">{name}</DialogTitle>
      <DialogContent>
        {Previewer ? (
          <Previewer downloadUrl={downloadUrl} />
        ) : (
          <iframe title={`${name} file preview`} src={downloadUrl} />
        )}
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
