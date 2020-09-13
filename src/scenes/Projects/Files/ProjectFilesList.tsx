import {
  Box,
  Breadcrumbs,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { CreateNewFolder, Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import { File as CFFile } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { useDialog } from '../../../components/Dialog';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  FileActionsContextProvider,
  getPermittedFileActions,
  isFileVersion,
  useFileActions,
} from '../../../components/files/FileActions';
import {
  FileNodeInfo_Directory_Fragment,
  FileNodeInfo_FileVersion_Fragment,
  FileNodeInfoFragment,
} from '../../../components/files/files.generated';
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
import {
  ProjectDirectoryFileNodeFragment,
  useProjectDirectoryQuery,
} from './ProjectFiles.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';
import { useUploadProjectFiles } from './useUploadProjectFiles';

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

type ProjectDirectoryNonVersion = Exclude<
  ProjectDirectoryFileNodeFragment,
  FileNodeInfo_FileVersion_Fragment
>;

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

  const uploadFiles = useUploadProjectFiles();

  const [createDirectoryState, createDirectory] = useDialog();

  const handleDrop = (files: File[]) => {
    uploadFiles({ files, parentId: directoryId });
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

  const shouldSkipQuery = !directoryId;
  const { data, loading, error } = useProjectDirectoryQuery({
    variables: {
      id: directoryId,
    },
    // Workaround for a known bug in Apollo client that causes
    // `skip` to suddenly be ignored when `client.resetStore` is
    // called:
    // https://github.com/apollographql/react-apollo/issues/3492#issuecomment-622573677
    fetchPolicy: shouldSkipQuery ? 'cache-only' : 'cache-first',
    skip: shouldSkipQuery,
  });

  const parents = data?.directory.parents;
  const breadcrumbsParents = parents?.slice(0, -1) ?? [];

  const directoryIsNotInProject =
    !directoryLoading &&
    isNotRootDirectory &&
    parents &&
    !parents.some((parent) => parent.id === rootDirectoryId);

  const items = directoryIsNotInProject ? [] : data?.directory.children.items;

  interface FileRowData {
    id: FileNodeInfoFragment['id'];
    type: FileNodeInfoFragment['type'];
    name: FileNodeInfoFragment['name'];
    createdAt: string;
    createdBy: string;
    mimeType: CFFile['mimeType'];
    size: number;
    item: ProjectDirectoryNonVersion;
  }

  const isDirectory = (
    fileNode: FileNodeInfoFragment
  ): fileNode is FileNodeInfo_Directory_Fragment => {
    return fileNode.__typename === 'Directory';
  };

  const rowData =
    items?.reduce((rows: FileRowData[], item) => {
      if (isFileVersion(item)) return rows;
      const { id, name, type, createdAt, createdBy } = item;
      const row = {
        id,
        type,
        name,
        createdAt: formatDate(createdAt),
        createdBy: createdBy.fullName ?? '',
        mimeType: isDirectory(item) ? 'directory' : item.mimeType,
        size: isDirectory(item) ? 0 : item.size,
        item,
      };
      return rows.concat(row);
    }, []) ?? [];

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
              uploadFiles({
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
        width: spacing(6),
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
      <input {...getInputProps()} name="files_list_uploader" />
      <DropzoneOverlay
        isDragActive={isDragActive}
        message="Drop files to start uploading"
      />
      <ContentContainer>
        {error || (!loading && !items) ? (
          <Typography variant="h4">Error fetching Project Files</Typography>
        ) : directoryIsNotInProject ? (
          <Typography variant="h4">
            This folder does not exist in this project
          </Typography>
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
                  <Breadcrumb to={`/projects/${projectId}/files`}>
                    Files
                  </Breadcrumb>
                  {breadcrumbsParents.map((parent) => (
                    <Breadcrumb
                      key={parent.id}
                      to={`/projects/${projectId}/files/${parent.id}`}
                    >
                      {parent.name}
                    </Breadcrumb>
                  ))}
                  {isNotRootDirectory && (
                    <Breadcrumb
                      to={`/projects/${projectId}/files/${directoryId}`}
                    >
                      {data?.directory.name}
                    </Breadcrumb>
                  )}
                </Breadcrumbs>
              </Box>
            )}
            <section className={classes.tableWrapper}>
              {loading ? (
                <Skeleton variant="rect" width="100%" height={200} />
              ) : (
                <Table
                  data={rowData}
                  columns={columns}
                  onRowClick={handleRowClick}
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
              )}
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
