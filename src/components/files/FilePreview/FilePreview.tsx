import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from '@mui/material';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { NonDirectoryActionItem } from '../FileActions';
import { getFileComponents } from '../fileTypes';
import { PreviewError } from './PreviewError';
import { PreviewLoading } from './PreviewLoading';

export interface PreviewerProps {
  file: NonDirectoryActionItem;
  onClose: () => void;
}

interface FilePreviewProps extends DialogProps, Pick<PreviewerProps, 'file'> {}

export const FilePreview = ({ file, ...props }: FilePreviewProps) => {
  const handleClose = () => {
    props.onClose?.({}, 'backdropClick');
  };
  return (
    <Dialog {...props} maxWidth={false} aria-labelledby="dialog-file-preview">
      <DialogTitle id="dialog-file-preview">{file.name}</DialogTitle>
      <DialogContent>
        <Previewer file={file} onClose={handleClose} />
      </DialogContent>
      <DialogActions>
        <Button href={file.url} color="secondary" onClick={handleClose}>
          Download
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const Previewer = (props: PreviewerProps) => {
  const { Previewer: ResolvedPreviewer } = getFileComponents(
    props.file.mimeType
  );
  return (
    <ErrorBoundary FallbackComponent={PreviewError}>
      <Suspense fallback={<PreviewLoading />}>
        <ResolvedPreviewer {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};
