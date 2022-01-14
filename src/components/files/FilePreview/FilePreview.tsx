import { lazy as loadable } from '@loadable/component';
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
import React, { FC, Suspense, useCallback, useEffect, useState } from 'react';
import { saveAs } from '../../../util/FileSaver';
import { NonDirectoryActionItem } from '../FileActions';
import {
  previewableAudioTypes,
  previewableImageTypes,
  PreviewableMimeType,
  previewableVideoTypes,
} from '../fileTypes';
import { useGetFileDownloadUrl } from '../hooks';
import { HtmlPreview } from './HtmlPreview';
import { NativePreview, NativePreviewType } from './NativePreview';
import { PlainTextPreview } from './PlainTextPreview';
import { PreviewError } from './PreviewError';
import { PreviewLoading } from './PreviewLoading';
import { PreviewNotSupported } from './PreviewNotSupported';

const PdfPreview = loadable(() => import('./PdfPreview'));
const CsvPreview = loadable(() => import('./CsvPreview'));
const ExcelPreview = loadable(() => import('./ExcelPreview'));
const RtfPreview = loadable(() => import('./RtfPreview'));
const WordPreview = loadable(() => import('./WordPreview'));
const EmailPreview = loadable(() => import('./EmailPreview'));

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
  'application/vnd.ms-excel.sheet.macroenabled.12': {
    component: ExcelPreview,
    props: {},
  },
  'application/vnd.ms-excel.sheet.macroEnabled.12': {
    component: ExcelPreview,
    props: {},
  },
  'application/vnd.ms-excel.sheet.binary.macroenabled.12': {
    component: ExcelPreview,
    props: {},
  },
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12': {
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
  'application/vnd.ms-outlook': {
    component: EmailPreview,
    props: {},
  },
  'text/csv': {
    component: CsvPreview,
    props: {},
  },
  'application/rtf': {
    component: RtfPreview,
    props: {},
  },
  'text/rtf': {
    component: RtfPreview,
    props: {},
  },
  'text/plain': {
    component: PlainTextPreview,
    props: { mimeType: 'text/plain' },
  },
  'text/css': {
    component: PlainTextPreview,
    props: { mimeType: 'text/css' },
  },
  'text/html': {
    component: HtmlPreview,
    props: { mimeType: 'text/html' },
  },
  ...imagePreviewers,
  ...audioPreviewers,
  ...videoPreviewers,
};

export const FilePreview: FC<FilePreviewProps> = (props) => {
  const classes = useStyles();
  const [previewFile, setPreviewFile] = useState<File | string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const getDownloadUrl = useGetFileDownloadUrl();
  const { file, onClose, ...rest } = props;
  const { id, mimeType, name } = file ?? {
    id: '',
    mimeType: '',
    name: '',
  };

  const handleDownload = () =>
    saveAs(previewFile!, file!.name, { skipCorsCheck: true });

  const handleError = useCallback(
    (error: string) => {
      setPreviewError(error);
      setPreviewLoading(false);
    },
    [setPreviewError, setPreviewLoading]
  );

  const nativeMimeTypes = [
    ...previewableImageTypes,
    ...previewableAudioTypes,
    ...previewableVideoTypes,
  ].map((type) => type.mimeType);
  const usesNativePreviewer = nativeMimeTypes.includes(mimeType);

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
            if (usesNativePreviewer) {
              setPreviewFile(downloadUrl);
              setPreviewLoading(false);
              return;
            }
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
    usesNativePreviewer,
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
              <Suspense fallback={<PreviewLoading />}>
                <Previewer
                  file={previewFile}
                  previewLoading={previewLoading}
                  setPreviewLoading={setPreviewLoading}
                  previewError={previewError}
                  setPreviewError={handleError}
                  {...previewerProps}
                />
              </Suspense>
            ) : (
              <PreviewNotSupported file={file} onClose={onClose} />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={handleDownload}
          disabled={!previewFile}
        >
          Download
        </Button>
        <Button color="secondary" onClick={handleCloseButtonClick}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
