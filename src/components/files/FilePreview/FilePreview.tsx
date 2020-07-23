import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { FC } from 'react';
import { File } from '../../../api';
import { ExcelPreview } from './ExcelPreview';
import { PdfPreview } from './PdfPreview';
import { PreviewContextProvider, usePreview } from './PreviewContext';
import { PreviewError } from './PreviewError';
import { WordPreview } from './WordPreview';

export interface PreviewerProps {
  downloadUrl: string;
}

interface FilePreviewProps {
  file?: File;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

const previewers = {
  'application/pdf': PdfPreview,
  'application/vnd.ms-excel': ExcelPreview,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ExcelPreview,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': WordPreview,
};

const FilePreviewWrapped: FC<FilePreviewProps> = (props) => {
  const { file, onClose, ...rest } = props;
  const { downloadUrl, mimeType, name } = file ?? {
    downloadUrl: '',
    mimeType: '',
    name: '',
  };
  const { previewError } = usePreview();
  const Previewer = previewers[mimeType as keyof typeof previewers];
  return (
    <Dialog
      onClose={onClose}
      {...rest}
      maxWidth={false}
      aria-labelledby="dialog-file-preview"
    >
      <DialogTitle id="dialog-file-preview">{name}</DialogTitle>
      <DialogContent>
        <Box>
          {previewError ? (
            <PreviewError errorText={previewError} />
          ) : Previewer ? (
            <Previewer downloadUrl={downloadUrl} />
          ) : (
            <iframe title={`${name} file preview`} src={downloadUrl} />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const FilePreview: FC<FilePreviewProps> = (props) => {
  return (
    <PreviewContextProvider>
      <FilePreviewWrapped {...props} />
    </PreviewContextProvider>
  );
};
