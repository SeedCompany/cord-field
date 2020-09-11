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
import { File } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useDialog } from '../../../components/Dialog';
import {
  FileActionsPopup as ActionsMenu,
  FileActionsContextProvider,
  useFileActions,
} from '../../../components/files/FileActions';
import {
  FileNodeInfo_Directory_Fragment,
  FileNodeInfo_File_Fragment,
  FileNodeInfo_FileVersion_Fragment,
  FileNodeInfoFragment,
} from '../../../components/files/files.generated';
import { fileIcon } from '../../../components/files/fileTypes';
import {
  formatFileSize,
  parseFileNameAndExtension,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Table } from '../../../components/Table';
import { CreateProjectDirectory } from './CreateProjectDirectory';
import {
  ProjectDirectoryFileNodeFragment,
  useProjectDirectoryQuery,
} from './ProjectFiles.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';
import { useUploadProjectFiles } from './useUploadProjectFiles';

const useStyles = makeStyles(({ palette, spacing }) => ({
  dropzone: {
    overflowY: 'scroll',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  dropContainer: {
    backgroundColor: palette.action.disabled,
    border: `4px dashed ${palette.divider}`,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.7,
    padding: spacing(3),
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
  },
  instructions: {
    color: palette.text.secondary,
    textAlign: 'center',
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
    marginTop: spacing(4),
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

export type ProjectDirectoryDirectory = Exclude<
  ProjectDirectoryFileNodeFragment,
  FileNodeInfo_FileVersion_Fragment | FileNodeInfo_File_Fragment
>;
export type ProjectDirectoryFile = Exclude<
  ProjectDirectoryFileNodeFragment,
  FileNodeInfo_Directory_Fragment | FileNodeInfo_FileVersion_Fragment
>;
export type ProjectDirectoryNonVersion = Exclude<
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

  const handleFilesDrop = useUploadProjectFiles(directoryId);

  const [createDirectoryState, createDirectory] = useDialog();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFileBrowser,
  } = useDropzone({
    onDrop: handleFilesDrop,
    noClick: true,
    noKeyboard: true,
    disabled: !directoryId,
  });

  const isNotRootDirectory = directoryId !== rootDirectoryId;

  const { data, loading, error } = useProjectDirectoryQuery({
    variables: {
      id: directoryId,
    },
    skip: !directoryId,
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
    mimeType: File['mimeType'];
    size: number;
    item: ProjectDirectoryNonVersion;
  }

  const isDirectory = (
    fileNode: FileNodeInfoFragment
  ): fileNode is FileNodeInfo_Directory_Fragment => {
    return fileNode.__typename === 'Directory';
  };

  const isFileVersion = (
    fileNode: FileNodeInfoFragment
  ): fileNode is FileNodeInfo_FileVersion_Fragment => {
    return fileNode.__typename === 'FileVersion';
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
      render: (rowData: FileRowData) => <ActionsMenu item={rowData.item} />,
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
      {isDragActive && (
        <div className={classes.dropContainer}>
          <Typography variant="h1" className={classes.instructions}>
            Drop files to start uploading
          </Typography>
        </div>
      )}
      <Content>
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
      </Content>
    </div>
  );
};

export const ProjectFilesList: FC = () => (
  <FileActionsContextProvider>
    <ProjectFilesListWrapped />
  </FileActionsContextProvider>
);
