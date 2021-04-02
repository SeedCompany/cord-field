import { useQuery } from '@apollo/client';
import {
  Box,
  Breadcrumbs,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { CreateNewFolder, Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { useDialog } from '../../../components/Dialog';
import { Error } from '../../../components/Error';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  FileActionsContextProvider,
  getPermittedFileActions,
  isFileVersion,
  useFileActions,
} from '../../../components/files/FileActions';
import { fileIcon } from '../../../components/files/fileTypes';
import {
  formatFileSize,
  parseFileNameAndExtension,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Table } from '../../../components/Table';
import { DropzoneOverlay } from '../../../components/Upload';
import { CreateProjectDirectory } from './CreateProjectDirectory';
import { DirectoryBreadcrumb } from './DirectoryBreadcrumb';
import { FileRow } from './FileRow';
import { NodePreviewLayer } from './NodePreviewLayer';
import { ProjectDirectoryDocument } from './ProjectFiles.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';
import { useUploadProjectFiles } from './useUploadProjectFiles';
import { Directory, FileOrDirectory, isDirectory } from './util';

type FileRowData = Pick<FileOrDirectory, 'id' | 'type' | 'name'> & {
  createdAt: string;
  createdBy: string;
  mimeType: string;
  size: number;
  item: FileOrDirectory;
  parent: Directory;
};

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  dropzone: {
    overflowY: 'auto',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
  },
  toolbarContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    padding: spacing(1),
    width: '100%',
  },
  tableWrapper: {
    margin: spacing(4, 4, 4, 0),
    maxWidth: breakpoints.values.md,
  },
  folderLink: {
    color: 'inherit',
  },
  fileName: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  fileIcon: {
    color: palette.action.active,
    marginRight: spacing(0.5),
  },
}));

const ProjectFilesListWrapped: FC = () => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const formatDate = useDateTimeFormatter();

  const { openFilePreview } = useFileActions();

  const {
    loading: directoryLoading,
    canRead: canReadRootDirectory,
    project,
    directoryId,
    rootDirectoryId,
  } = useProjectCurrentDirectory();

  const uploadProjectFiles = useUploadProjectFiles();

  const [createDirectoryState, createDirectory] = useDialog();

  const handleDrop = (files: File[]) => {
    uploadProjectFiles({ files, parentId: directoryId });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileBrowser,
  } = useDropzone({
    onDrop: handleDrop,
    noClick: true,
    noKeyboard: true,
    disabled: !directoryId,
  });

  const isNotRootDirectory = directoryId !== rootDirectoryId;

  const { data, loading, error } = useQuery(ProjectDirectoryDocument, {
    variables: {
      id: directoryId,
    },
    skip: !directoryId,
  });

  // Don't wait for data to load table js code
  useEffect(() => Table.preload(), []);

  const parents = data?.directory.parents;
  const breadcrumbsParents = parents?.slice(0, -1) ?? [];

  const directoryIsNotInProject =
    !directoryLoading &&
    isNotRootDirectory &&
    parents &&
    !parents.some((parent) => parent.id === rootDirectoryId);

  const items = directoryIsNotInProject ? [] : data?.directory.children.items;

  const rowData = (items ?? []).flatMap<FileRowData>((item) => {
    if (isFileVersion(item)) return [];
    const { id, name, type, createdAt, createdBy } = item;
    return {
      id,
      type,
      name,
      createdAt: formatDate(createdAt),
      createdBy: createdBy.fullName ?? '',
      mimeType: isDirectory(item) ? 'directory' : item.mimeType,
      size: isDirectory(item) ? 0 : item.size,
      item,
      parent: data!.directory,
    };
  });

  const columns = [
    {
      title: 'ID',
      field: 'id',
      hidden: true,
    },
    {
      title: 'Type',
      field: 'type',
      hidden: true,
    },
    {
      title: 'Mime Type',
      field: 'mimeType',
      hidden: true,
    },
    {
      title: 'Name',
      field: 'name',
      render: (rowData: FileRowData) => {
        const { name, mimeType } = rowData;
        const Icon = fileIcon(mimeType);
        return (
          <span className={classes.fileName}>
            <Icon className={classes.fileIcon} />
            {parseFileNameAndExtension(name).displayName}
          </span>
        );
      },
    },
    {
      title: 'Created',
      field: 'createdAt',
    },
    {
      title: 'Uploaded By',
      field: 'createdBy',
    },
    {
      title: 'File Size',
      field: 'size',
      render: (rowData: FileRowData) => {
        const { type, size } = rowData;
        return type === 'Directory' ? '–' : formatFileSize(Number(size));
      },
    },
    {
      title: '',
      field: 'item',
      render: (rowData: FileRowData) => {
        const permittedActions = getPermittedFileActions(
          !!canReadRootDirectory,
          !!canReadRootDirectory
        );
        const directoryActions = permittedActions.filter(
          (action) =>
            action === FileAction.Rename || action === FileAction.Delete
        );
        return (
          <ActionsMenu
            actions={
              rowData.type === 'Directory' ? directoryActions : permittedActions
            }
            item={rowData.item}
            onVersionUpload={(files) =>
              uploadProjectFiles({
                action: 'version',
                files,
                parentId: rowData.item.id,
              })
            }
          />
        );
      },
      sorting: false,
      cellStyle: {
        padding: spacing(0.5),
      },
      headerStyle: {
        padding: spacing(0.5),
      },
    },
  ];

  const handleRowClick = (rowData: FileRowData) => {
    const { id, item } = rowData;
    if (isDirectory(item)) {
      navigate(`/projects/${projectId}/files/${id}`);
    } else {
      openFilePreview(item);
    }
  };

  return directoryLoading ? null : canReadRootDirectory === false ? (
    <Typography color="textSecondary">
      You do not have permission to see files for this project
    </Typography>
  ) : (
    <div className={classes.dropzone} {...getRootProps()}>
      <Helmet
        title={`${isNotRootDirectory ? data?.directory.name : 'Files'} - ${
          project ? project.name.value ?? 'A Project' : '...'
        }`}
      />
      <input {...getInputProps()} name="files_list_uploader" />
      <DropzoneOverlay
        isDragActive={isDragActive}
        message="Drop files to start uploading"
      />
      <ContentContainer>
        {error || (!loading && !items) ? (
          <Error show error={error}>
            Error loading project's files
          </Error>
        ) : directoryIsNotInProject ? (
          <Error show>This folder does not exist in this project</Error>
        ) : (
          <>
            {loading ? (
              <Skeleton variant="text" width="20%" />
            ) : (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Breadcrumbs>
                  <ProjectBreadcrumb data={project} />
                  <DirectoryBreadcrumb
                    // no moving to same directory
                    id={isNotRootDirectory ? rootDirectoryId : undefined}
                    name="Files"
                    to={`/projects/${projectId}/files`}
                  />
                  {breadcrumbsParents.map((parent) => (
                    <DirectoryBreadcrumb
                      key={parent.id}
                      id={parent.id}
                      name={parent.name}
                      to={`/projects/${projectId}/files/${parent.id}`}
                    />
                  ))}
                  {isNotRootDirectory && (
                    <DirectoryBreadcrumb
                      name={data?.directory.name}
                      to={`/projects/${projectId}/files/${directoryId}`}
                    />
                  )}
                </Breadcrumbs>
              </Box>
            )}
            <section className={classes.tableWrapper}>
              <Table
                isLoading={loading}
                data={rowData}
                columns={columns}
                onRowClick={handleRowClick}
                components={{
                  Row: FileRow,
                }}
                actions={[
                  {
                    icon: Publish,
                    tooltip: 'Upload Files',
                    isFreeAction: true,
                    onClick: openFileBrowser,
                  },
                  {
                    icon: CreateNewFolder,
                    tooltip: 'Create Folder',
                    isFreeAction: true,
                    onClick: createDirectory,
                  },
                ]}
              />
              <NodePreviewLayer />
            </section>
          </>
        )}
        <CreateProjectDirectory {...createDirectoryState} />
      </ContentContainer>
    </div>
  );
};

export const ProjectFilesList: FC = () => (
  <FileActionsContextProvider>
    <ProjectFilesListWrapped />
  </FileActionsContextProvider>
);
