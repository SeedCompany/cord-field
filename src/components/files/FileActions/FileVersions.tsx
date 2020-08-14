import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  List,
} from '@material-ui/core';
import React, { FC, Fragment } from 'react';
import { ProjectDirectoryFile } from '../../../scenes/Projects/Files';
import { DialogState } from '../../Dialog';
import {
  FileVersionItem,
  FileVersionItem_FileVersion_Fragment,
} from '../FileVersionItem';
import { useFileVersionsQuery } from './FileActions.generated';

type FileVersionsList = FileVersionItem_FileVersion_Fragment[];

type FileVersionsProps = DialogState & {
  file: ProjectDirectoryFile | undefined;
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

  const versions: FileVersionsList =
    data?.file.children.items.filter(
      (item): item is FileVersionItem_FileVersion_Fragment => {
        return item.__typename === 'FileVersion';
      }
    ) ?? [];

  return !file || loading ? null : (
    <>
      <Dialog {...dialogProps} aria-labelledby="dialog-file-versions">
        <DialogTitle id="dialog-file-versions">File History</DialogTitle>
        <List dense>
          {versions.map((version, index) => (
            <Fragment key={version.id}>
              <FileVersionItem version={version} />
              {total && index !== total - 1 && <Divider />}
            </Fragment>
          ))}
        </List>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
