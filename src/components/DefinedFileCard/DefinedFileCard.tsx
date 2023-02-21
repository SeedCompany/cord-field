import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import {
  Add as AddIcon,
  NotInterested as NotPermittedIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Card,
  CardActionArea,
  Skeleton,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { forwardRef, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { makeStyles } from 'tss-react/mui';
import { CreateDefinedFileVersionInput } from '~/api/schema.graphql';
import { SecuredProp, StyleProps } from '~/common';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  getPermittedFileActions,
  useFileActions,
} from '../files/FileActions';
import { FileNodeInfo_File_Fragment as FileNode } from '../files/files.graphql';
import { HandleUploadCompletedFunction, useUploadFiles } from '../files/hooks';
import { FormattedDateTime } from '../Formatters';
import { HugeIcon, ReportIcon } from '../Icons';
import { Redacted } from '../Redacted';
import { DropOverlay } from '../Upload/DropOverlay';

const useStyles = makeStyles()(({ palette, spacing }) => ({
  root: {
    flex: 1,
    position: 'relative',
  },
  addActionArea: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: spacing(3, 4),
  },
  editActionArea: {
    flex: 1,
    height: '100%',
    display: 'flex',
    padding: spacing(3, 4),
    position: 'relative',
  },
  avatar: {
    width: 58,
    height: 58,
  },
  addIcon: {
    color: 'white',
  },
  icon: {
    marginRight: spacing(4),
  },
  info: {
    flex: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  fileInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fileName: {
    marginBottom: spacing(1),
    marginRight: spacing(2), // so it doesn't collide with abs pos context menu
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
  text: {
    marginTop: spacing(1),
    textTransform: 'none',
  },
}));

export interface DefinedFileCardProps extends StyleProps {
  label: ReactNode;
  resourceType: string;
  securedFile: SecuredProp<FileNode>;
  uploadMutationDocument: DocumentNode<
    unknown,
    { id: string; upload: CreateDefinedFileVersionInput }
  >;
  parentId: string;
  disableIcon?: boolean;
  onUpload?: (arg: {
    files: File[];
    submit: (next: HandleUploadCompletedFunction) => void;
  }) => void;
}

interface FileCardMetaProps {
  canRead: boolean;
  loading: boolean;
  resourceType: DefinedFileCardProps['resourceType'];
  text: ReactNode;
}

const FileCardMeta = ({
  canRead,
  loading,
  resourceType,
  text,
}: FileCardMetaProps) => {
  const { classes } = useStyles();
  return (
    <Typography
      className={classes.fileMeta}
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

export const DefinedFileCard = forwardRef<any, DefinedFileCardProps>(
  function DefinedFileCard(props, ref) {
    const { classes, cx } = useStyles();
    const {
      label,
      resourceType,
      securedFile,
      uploadMutationDocument,
      parentId,
      disableIcon,
      onUpload,
      className,
      sx,
      ...rest
    } = props;
    const { value: file, canRead, canEdit } = securedFile;

    const uploadFiles = useUploadFiles();

    const [uploadFile] = useMutation(uploadMutationDocument);

    const handleUploadCompleted: HandleUploadCompletedFunction = async ({
      uploadId,
      name,
      parentId: id,
    }) => {
      await uploadFile({
        variables: {
          id,
          upload: { uploadId, name },
        },
      });
    };

    const onVersionUpload = (files: File[]) => {
      (onUpload ?? (({ submit }) => submit(handleUploadCompleted)))({
        files,
        submit: (next) =>
          uploadFiles({ files, handleUploadCompleted: next, parentId }),
      });
    };

    const { openFilePreview } = useFileActions();

    const standardFileActions = getPermittedFileActions(canRead, canEdit);
    // Defined Files seem like they'll probably always have fixed names
    const noRenameFileActions = standardFileActions.filter(
      (action) => action !== FileAction.Rename
    );
    const permittedFileActions = {
      // We only want to allow deletion of Defined File `Versions`,
      // not the files themselves.
      file: noRenameFileActions.filter(
        (action) => action !== FileAction.Delete
      ),
      version: noRenameFileActions,
    };

    const isCardDisabled = (file && !canRead) || (!file && !canEdit);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: onVersionUpload,
      disabled: isCardDisabled,
      multiple: false,
      noClick: !!file,
      noKeyboard: !!file,
    });

    const { modifiedAt, name, modifiedBy } = file ?? {
      modifiedAt: DateTime.local(),
      name: '',
      modifiedBy: {
        fullName: '',
      },
    };

    const { fullName } = modifiedBy;

    const Icon = !file && canEdit ? AddIcon : NotPermittedIcon;

    const card = (
      <Card {...getRootProps()} className={cx(classes.root, className)} sx={sx}>
        <input {...getInputProps()} name="defined_file_version_uploader" />
        <DropOverlay isDragActive={isDragActive}>
          {!file ? `Add ${label} file` : 'Drop new version to upload'}
        </DropOverlay>
        <CardActionArea
          {...rest}
          ref={ref}
          className={!file ? classes.addActionArea : classes.editActionArea}
          disabled={isCardDisabled}
          onClick={() => file && openFilePreview(file)}
        >
          {!file ? (
            <>
              <Avatar classes={{ root: classes.avatar }}>
                <Icon className={classes.addIcon} fontSize="large" />
              </Avatar>
              <Typography
                variant="button"
                align="center"
                className={classes.text}
              >
                {canEdit ? `Add ${label}` : `No ${label} uploaded`}
              </Typography>
            </>
          ) : (
            <>
              {!disableIcon && (
                <HugeIcon
                  icon={ReportIcon}
                  loading={!file}
                  className={classes.icon}
                />
              )}
              <div className={classes.info}>
                <Typography className={classes.fileName} variant="h4">
                  {label}
                </Typography>
                <div className={classes.fileInfo}>
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
                        Updated by {fullName} at{' '}
                        <FormattedDateTime date={modifiedAt} />
                      </>
                    }
                  />
                </div>
              </div>
            </>
          )}
        </CardActionArea>
        {file && canRead && (
          <div className={classes.actionsMenu}>
            <ActionsMenu
              actions={permittedFileActions}
              item={file}
              onVersionUpload={onVersionUpload}
            />
          </div>
        )}
      </Card>
    );

    return card;
  }
);
