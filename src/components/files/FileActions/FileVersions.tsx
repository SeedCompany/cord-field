import { useQuery } from '@apollo/client';
import {
  Button,
  Dialog,
  DialogActions,
  DialogProps,
  DialogTitle,
  Divider,
  List,
  makeStyles,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { Fragment } from 'react';
import { FileActionItem, PermittedActions } from '../FileActions';
import {
  FileVersionItem_FileVersion_Fragment as FileVersion,
  FileVersionItem,
} from '../FileVersionItem';
import { FileVersionsDocument } from './FileActions.graphql';

const useStyles = makeStyles(({ spacing }) => ({
  skeleton: {
    padding: spacing(1, 3),
  },
}));

type FileVersionsProps = DialogProps & {
  file: FileActionItem | undefined;
  actions: PermittedActions | undefined;
};

export const FileVersions = (props: FileVersionsProps) => {
  const { file, actions, ...dialogProps } = props;
  const { onClose } = dialogProps;

  const classes = useStyles();

  const id = file?.id ?? '';
  const { data, loading } = useQuery(FileVersionsDocument, {
    variables: { id },
    skip: !file,
  });

  const total = data?.file.children.total;

  const versions =
    data?.file.children.items.filter((item): item is FileVersion => {
      return item.__typename === 'FileVersion';
    }) ?? [];

  const menuActions = actions
    ? Array.isArray(actions)
      ? actions
      : actions.version
    : [];

  return !file ? null : (
    <Dialog {...dialogProps} aria-labelledby="dialog-file-versions">
      <DialogTitle id="dialog-file-versions">File History</DialogTitle>
      <List dense>
        {loading
          ? [0, 1, 2].map((item) => (
              <React.Fragment key={item}>
                <div className={classes.skeleton}>
                  <Skeleton variant="rect" width={400} height={50} />
                </div>
                {item < 2 && <Divider />}
              </React.Fragment>
            ))
          : versions.map((version, index) => (
              <Fragment key={version.id}>
                <FileVersionItem version={version} actions={menuActions} />
                {total && index !== total - 1 && <Divider />}
              </Fragment>
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
