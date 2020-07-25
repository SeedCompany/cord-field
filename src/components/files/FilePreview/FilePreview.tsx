import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import React, { FC } from 'react';
import { File } from '../../../api';
import { ExcelPreview } from './ExcelPreview';
import { NativePreview, NativePreviewType } from './NativePreview';
import { PdfPreview } from './PdfPreview';
import { PreviewContextProvider, usePreview } from './PreviewContext';
import { PreviewError } from './PreviewError';
import { WordPreview } from './WordPreview';

const useStyles = makeStyles(() => ({
  dialogContent: {
    height: '100%',
  },
}));

export interface PreviewerProps {
  downloadUrl: string;
}

interface FilePreviewProps {
  file?: File;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

const imageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];
const imagePreviewers = imageTypes.reduce(
  (previewers, imageType) => ({
    ...previewers,
    [imageType]: {
      component: NativePreview,
      props: { type: NativePreviewType.Image },
    },
  }),
  {}
);

const videoTypes = [
  'video/3gpp',
  'video/3gpp2',
  'video/mp2t',
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  'video/x-msvideo',
];
const videoPreviewers = videoTypes.reduce(
  (previewers, videoType) => ({
    ...previewers,
    [videoType]: {
      component: NativePreview,
      props: { type: NativePreviewType.Video },
    },
  }),
  {}
);

const previewers = {
  'application/pdf': {
    component: PdfPreview,
    props: {},
  },
  'application/vnd.ms-excel': {
    component: ExcelPreview,
    props: {},
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    component: ExcelPreview,
    props: {},
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    component: WordPreview,
    props: {},
  },
  ...imagePreviewers,
  ...videoPreviewers,
};

const FilePreviewWrapped: FC<FilePreviewProps> = (props) => {
  const classes = useStyles();
  const { file, onClose, ...rest } = props;
  const { downloadUrl, mimeType, name } = file ?? {
    downloadUrl: '',
    mimeType: '',
    name: '',
  };
  const { previewError } = usePreview();
  const Previewer = previewers[mimeType as keyof typeof previewers]?.component;
  const previewerProps = previewers[mimeType as keyof typeof previewers]?.props;
  return (
    <Dialog
      onClose={onClose}
      {...rest}
      maxWidth={false}
      aria-labelledby="dialog-file-preview"
    >
      <DialogTitle id="dialog-file-preview">{name}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Box height="100%">
          {previewError ? (
            <PreviewError errorText={previewError} />
          ) : Previewer ? (
            <Previewer downloadUrl={downloadUrl} {...previewerProps} />
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
