import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  makeStyles,
} from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { NonDirectoryActionItem, useFileActions } from '../FileActions';
import {
  previewableAudioTypes,
  previewableImageTypes,
  PreviewableMimeType,
  previewableVideoTypes,
} from '../fileTypes';
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

interface FilePreviewProps extends DialogProps {
  file?: NonDirectoryActionItem;
}

const imagePreviewers = previewableImageTypes.reduce(
  (previewers, imageType) => ({
    ...previewers,
    [imageType.mimeType]: {
      component: NativePreview,
      props: { type: NativePreviewType.Image, mimeType: imageType.mimeType },
    },
  }),
  {}
);

const audioPreviewers = previewableAudioTypes.reduce(
  (previewers, audioType) => ({
    ...previewers,
    [audioType.mimeType]: {
      component: NativePreview,
      props: { type: NativePreviewType.Audio, mimeType: audioType.mimeType },
    },
  }),
  {}
);

const videoPreviewers = previewableVideoTypes.reduce(
  (previewers, videoType) => ({
    ...previewers,
    [videoType.mimeType]: {
      component: NativePreview,
      props: { type: NativePreviewType.Video, mimeType: videoType.mimeType },
    },
  }),
  {}
);

type PreviewerProperties = {
  [key in PreviewableMimeType]?: {
    component: React.ElementType;
    props: {
      type?: keyof NativePreviewType;
      mimeType?: PreviewableMimeType;
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
  const { previewError, setPreviewError } = useFileActions();
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

  const handleCloseButtonClick = () => {
    onClose?.({}, 'backdropClick');
  };

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
        <Button color="secondary" onClick={handleCloseButtonClick}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
