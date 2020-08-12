import {
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  Divider,
  List,
} from '@material-ui/core';
import React, { FC } from 'react';
import { File } from '../../../api';
import { FileVersionItem } from '../../../components/files/FileVersionItem';
import { useProjectFileVersionsQuery } from './ProjectFiles.generated';

type FileVersionsProps = DialogProps & {
  file: File | undefined;
};

export const FileVersions: FC<FileVersionsProps> = (props) => {
  const { file, ...dialogProps } = props;
  const { onClose } = dialogProps;
  const id = file?.id ?? '';
  const { data, loading } = useProjectFileVersionsQuery({
    variables: { id },
    skip: !file,
  });
  const total = data?.file.children.total;
  const versions = data?.file.children.items ?? [];

  return !file || loading ? null : (
    <Dialog {...dialogProps} aria-labelledby="dialog-file-versions">
      <DialogTitle id="dialog-file-versions">File History</DialogTitle>
      <List dense>
        {versions.map((version, index) => (
          <React.Fragment key={version.id}>
            <FileVersionItem version={version} />
            {total && index !== total - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
      <DialogActions>
        <Button
          color="secondary"
          onClick={(e) => onClose?.(e, 'backdropClick')}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
