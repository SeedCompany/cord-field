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
import React, { FC, useCallback, useEffect, useState } from 'react';
import { NonDirectoryActionItem } from '../FileActions';
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
  file?: File;
  previewLoading: boolean;
  setPreviewLoading: (loading: boolean) => void;
  previewError: string | null;
  setPreviewError: (error: string | null) => void;
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
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const getDownloadUrl = useGetFileDownloadUrl();
  const { file, onClose, ...rest } = props;
  const { id, mimeType, name } = file ?? {
    id: '',
    mimeType: '',
    name: '',
  };

  const handleError = useCallback(
    (error: string) => {
      setPreviewError(error);
      setPreviewLoading(false);
    },
    [setPreviewError, setPreviewLoading]
  );

  const Previewer = previewers[mimeType]?.component;
  const previewerProps = previewers[mimeType]?.props;

  const retrieveFile = useCallback(
    async (
      url: string,
      mimeType: PreviewableMimeType,
      onError: typeof handleError
    ) => {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          const blob = await response.blob();
          setPreviewFile(
            new File([blob], 'Preview', {
              type: mimeType,
            })
          );
        }
      } catch {
        onError('Could not retrieve file');
      }
    },
    []
  );

  useEffect(() => {
    if (id && Previewer) {
      setPreviewLoading(true);
      void getDownloadUrl(id)
        .then((downloadUrl) => {
          if (downloadUrl) {
            void retrieveFile(downloadUrl, mimeType, handleError);
          } else {
            handleError('Could not get file download URL');
          }
        })
        .catch(() => handleError('Could not get file download URL'));
    } else {
      setPreviewFile(null);
      setPreviewLoading(false);
    }
    return () => setPreviewError(null);
  }, [
    id,
    Previewer,
    mimeType,
    getDownloadUrl,
    handleError,
    retrieveFile,
    setPreviewError,
    setPreviewLoading,
  ]);

  const handleCloseButtonClick = () => {
    onClose?.({}, 'backdropClick');
  };

  return !file ? null : (
    <Dialog
      onClose={onClose}
      {...rest}
      maxWidth={false}
      aria-labelledby="dialog-file-preview"
    >
      <DialogTitle id="dialog-file-preview">{name}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container direction="column" spacing={2} alignItems="center">
          <Grid item>
            {previewError ? (
              <PreviewError errorText={previewError} />
            ) : Previewer ? (
              <Previewer
                file={previewFile}
                previewLoading={previewLoading}
                setPreviewLoading={setPreviewLoading}
                previewError={previewError}
                setPreviewError={handleError}
                {...previewerProps}
              />
            ) : (
              <PreviewNotSupported />
            )}
          </Grid>
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
