import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  List,
} from '@material-ui/core';
import React, { FC } from 'react';
import { File } from '../../../api';
import { DialogState } from '../../../components/Dialog';
import { FileVersionItem } from '../../../components/files/FileVersionItem/FileVersionItem';
import { useProjectFileVersionsQuery } from './ProjectFiles.generated';

type FileVersionsProps = DialogState & {
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
          <>
            <FileVersionItem key={version.id} version={version} />
            {total && index !== total - 1 && <Divider />}
          </>
        ))}
      </List>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
