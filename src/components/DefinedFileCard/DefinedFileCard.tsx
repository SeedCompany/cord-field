import { useMutation } from '@apollo/client';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import {
  Add as AddIcon,
  NotInterested as NotPermittedIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Skeleton,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { forwardRef, ReactNode } from 'react';
import { useDropzone } from 'react-dropzone';
import { CreateDefinedFileVersionInput } from '~/api/schema.graphql';
import { extendSx, SecuredProp, StyleProps } from '~/common';
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
import { DropzoneOverlay } from '../Upload';

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
  return (
    <Typography
      sx={(theme) => ({
        color: theme.palette.text.secondary,
      })}
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
      <Card
        {...getRootProps()}
        className={className}
        sx={[
          {
            flex: 1,
            position: 'relative',
          },
          ...extendSx(sx),
        ]}
      >
        <input {...getInputProps()} name="defined_file_version_uploader" />
        <DropzoneOverlay
          isDragActive={isDragActive}
          message={!file ? `Add ${label} file` : 'Drop new version to upload'}
          TypographyProps={{
            sx: (theme) => ({
              fontSize: theme.typography.h2.fontSize,
            }),
          }}
        />
        <CardActionArea
          {...rest}
          ref={ref}
          sx={
            !file
              ? (theme) => ({
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  padding: theme.spacing(3, 4),
                })
              : (theme) => ({
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  padding: theme.spacing(3, 4),
                  position: 'relative',
                })
          }
          disabled={isCardDisabled}
          onClick={() => file && openFilePreview(file)}
        >
          {!file ? (
            <>
              <Avatar
                sx={{
                  '&.MuiAvatar-root': {
                    width: 58,
                    height: 58,
                  },
                }}
              >
                <Icon
                  sx={{
                    color: 'white',
                  }}
                  fontSize="large"
                />
              </Avatar>
              <Typography
                variant="button"
                align="center"
                sx={(theme) => ({
                  marginTop: theme.spacing(1),
                  textTransform: 'none',
                })}
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
                  sx={(theme) => ({
                    marginRight: theme.spacing(4),
                  })}
                />
              )}
              <Box
                sx={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  sx={(theme) => ({
                    marginBottom: theme.spacing(1),
                    marginRight: theme.spacing(2), // so it doesn't collide with abs pos context menu
                  })}
                  variant="h4"
                >
                  {label}
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
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
                </Box>
              </Box>
            </>
          )}
        </CardActionArea>
        {file && canRead && (
          <Box
            sx={(theme) => ({
              margin: theme.spacing(1),
              position: 'absolute',
              right: 0,
              top: 0,
            })}
          >
            <ActionsMenu
              actions={permittedFileActions}
              item={file}
              onVersionUpload={onVersionUpload}
            />
          </Box>
        )}
      </Card>
    );

    return card;
  }
);
