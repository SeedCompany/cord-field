import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
} from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { File } from '../../../api';
import {
  AUDIO_TYPES,
  IMAGE_TYPES,
  SupportedType,
  VIDEO_TYPES,
} from '../FILE_MIME_TYPES';
import { useFileActions } from '../FileActions';
import { useGetFileDownloadUrl } from '../hooks';
import { CsvPreview } from './CsvPreview';
import { ExcelPreview } from './ExcelPreview';
import { NativePreview, NativePreviewType } from './NativePreview';
import { PdfPreview } from './PdfPreview';
import { PreviewError } from './PreviewError';
import { PreviewNotSupported } from './PreviewNotSupported';
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

const imagePreviewers = IMAGE_TYPES.reduce(
  (previewers, imageType) => ({
    ...previewers,
    [imageType]: {
      component: NativePreview,
      props: { type: NativePreviewType.Image },
    },
  }),
  {}
);

const audioPreviewers = AUDIO_TYPES.reduce(
  (previewers, audioType) => ({
    ...previewers,
    [audioType]: {
      component: NativePreview,
      props: { type: NativePreviewType.Audio },
    },
  }),
  {}
);

const videoPreviewers = VIDEO_TYPES.reduce(
  (previewers, videoType) => ({
    ...previewers,
    [videoType]: {
      component: NativePreview,
      props: { type: NativePreviewType.Video },
    },
  }),
  {}
);

type PreviewerProperties = {
  [key in SupportedType]?: {
    component: React.ElementType;
    props: {
      type?: keyof NativePreviewType;
    };
  };
};

const previewers: PreviewerProperties = {
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
  'text/csv': {
    component: CsvPreview,
    props: {},
  },
  ...imagePreviewers,
  ...audioPreviewers,
  ...videoPreviewers,
};

export const FilePreview: FC<FilePreviewProps> = (props) => {
  const classes = useStyles();
  const [downloadUrl, setDownloadUrl] = useState('');
  const {
    previewState: { previewError, setPreviewError },
  } = useFileActions();
  const getDownloadUrl = useGetFileDownloadUrl();
  const { file, onClose, ...rest } = props;
  const { id, mimeType, name } = file ?? {
    id: '',
    mimeType: '',
    name: '',
  };

  useEffect(() => {
    if (id) {
      void getDownloadUrl(id).then((downloadUrl) =>
        setDownloadUrl(downloadUrl)
      );
    } else {
      setDownloadUrl('');
    }
    return () => setPreviewError('');
  }, [id, getDownloadUrl, setPreviewError]);

  const Previewer = previewers[mimeType]?.component;
  const previewerProps = previewers[mimeType]?.props;
  return !downloadUrl ? null : (
    <Dialog
      onClose={onClose}
      {...rest}
      maxWidth={false}
      aria-labelledby="dialog-file-preview"
    >
      <DialogTitle id="dialog-file-preview">{name}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container direction="column" spacing={2} alignItems="center">
          {previewError ? (
            <PreviewError errorText={previewError} />
          ) : Previewer ? (
            <Previewer downloadUrl={downloadUrl} {...previewerProps} />
          ) : (
            <PreviewNotSupported />
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
