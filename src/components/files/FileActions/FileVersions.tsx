import {
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  Divider,
  List,
} from '@material-ui/core';
import React, { FC, Fragment } from 'react';
import { File } from '../../../api';
import { FileVersionItem } from '../FileVersionItem';
import { useFileVersionsQuery } from './FileActions.generated';

type FileVersionsProps = DialogProps & {
  file: File | undefined;
};

export const FileVersions: FC<FileVersionsProps> = (props) => {
  const { file, ...dialogProps } = props;
  const { onClose } = dialogProps;
  const id = file?.id ?? '';
  const { data, loading } = useFileVersionsQuery({
    variables: { id },
    skip: !file,
  });
  const total = data?.file.children.total;
  const versions =
    data?.file.children.items.filter((item) => item.type === 'FileVersion') ??
    [];

  return !file || loading ? null : (
    <Dialog {...dialogProps} aria-labelledby="dialog-file-versions">
      <DialogTitle id="dialog-file-versions">File History</DialogTitle>
      <DialogContent>
        <List dense>
          {versions.map((version, index) => (
            <Fragment key={version.id}>
              <FileVersionItem version={version} />
              {total && index !== total - 1 && <Divider />}
            </Fragment>
          ))}
        </List>
      </DialogContent>
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
