import {
  Card,
  CardActionArea,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React, { FC, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { Secured } from '../../api';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  getPermittedFileActions,
  useFileActions,
} from '../files/FileActions';
import { FileNodeInfo_File_Fragment as FileNode } from '../files/files.generated';
import { FormattedDateTime } from '../Formatters';
import { HugeIcon, ReportIcon } from '../Icons';
import { Redacted } from '../Redacted';
import { DropzoneOverlay } from '../Upload';

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
  root: {
    position: 'relative',
  },
  actionArea: {
    cursor: 'pointer',
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: spacing(3, 4),
    position: 'relative',
  },
  dropzoneText: {
    fontSize: typography.h2.fontSize,
  },
  fileInfo: {
    flex: 1,
    paddingLeft: spacing(4),
  },
  fileName: {
    marginBottom: spacing(1),
  },
  fileMeta: {
    color: palette.text.secondary,
  },
  actionsMenu: {
    margin: spacing(1),
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export interface DefinedFileCardProps {
  title: ReactNode;
  resourceType: string;
  securedFile: Secured<FileNode>;
  onVersionUpload: (files: File[]) => void;
}

interface FileCardMetaProps {
  canRead: boolean;
  loading: boolean;
  resourceType: DefinedFileCardProps['resourceType'];
  text: ReactNode;
}

const FileCardMeta: FC<FileCardMetaProps> = ({
  canRead,
  loading,
  resourceType,
  text,
}) => {
  const classes = useStyles();
  return (
    <Typography
      className={classes.fileMeta}
      color="initial"
      variant="caption"
      component="p"
      gutterBottom
    >
      {loading ? (
        <Skeleton />
      ) : !canRead ? (
        <Redacted
          info={`You do not have permission to view files for this ${resourceType}`}
        />
      ) : (
        text
      )}
    </Typography>
  );
};

export const DefinedFileCard = (props: DefinedFileCardProps) => {
  const classes = useStyles();
  const { title, onVersionUpload, resourceType, securedFile } = props;

  const { canRead, canEdit } = securedFile;
  const standardFileActions = getPermittedFileActions(canRead, canEdit);
  // Defined Files seem like they'll probably always have fixed names
  const noRenameFileActions = standardFileActions.filter(
    (action) => action !== FileAction.Rename
  );
  const permittedFileActions = {
    // We only want to allow deletion of Defined File `Versions`,
    // not the files themselves.
    file: noRenameFileActions.filter((action) => action !== FileAction.Delete),
    version: noRenameFileActions,
  };

  const file = securedFile.value;
  const { openFilePreview } = useFileActions();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onVersionUpload,
    disabled: !canEdit,
    multiple: false,
    noClick: true,
    noKeyboard: true,
  });

  const { modifiedAt, name, modifiedBy } = file ?? {
    modifiedAt: DateTime.local(),
    name: '',
    modifiedBy: {
      fullName: '',
    },
  };

  const { fullName } = modifiedBy;

  return (
    <Card {...getRootProps()} className={classes.root}>
      <input {...getInputProps()} name="defined_file_version_uploader" />
      <DropzoneOverlay
        classes={{ text: classes.dropzoneText }}
        isDragActive={isDragActive}
        message="Drop new version to upload"
      />
      <CardActionArea
        className={classes.actionArea}
        disabled={!canRead}
        onClick={() => file && openFilePreview(file)}
      >
        <HugeIcon icon={ReportIcon} loading={!file} />
        <div className={classes.fileInfo}>
          <Typography className={classes.fileName} color="initial" variant="h4">
            {file ? title : <Skeleton width="80%" />}
          </Typography>
          <FileCardMeta
            canRead={canRead}
            loading={!file}
            resourceType={resourceType}
            text={name}
          />
          <FileCardMeta
            canRead={canRead}
            loading={!file}
            resourceType={resourceType}
            text={
              <>
                Updated by {fullName} at <FormattedDateTime date={modifiedAt} />
              </>
            }
          />
        </div>
      </CardActionArea>
      {canRead && (
        <div className={classes.actionsMenu}>
          {file && (
            <ActionsMenu
              actions={permittedFileActions}
              item={file}
              onVersionUpload={onVersionUpload}
            />
          )}
        </div>
      )}
    </Card>
  );
};
