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
  FileActions,
  FileActionsContextProvider,
  useFileActions,
} from '../../../components/files/FileActions';
import { FilePreview } from '../../../components/files/FilePreview';
import {
  FileNodeInfo_Directory_Fragment,
  FileNodeInfo_File_Fragment,
  FileNodeInfo_FileVersion_Fragment,
  FileNodeInfoFragment,
} from '../../../components/files/files.generated';
import {
  useFileNameAndExtension,
  useFileNodeIcon,
} from '../../../components/files/hooks';
import {
  formatFileSize,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Table } from '../../../components/Table';
import { CreateProjectDirectory } from './CreateProjectDirectory';
import {
  ProjectDirectoryQuery,
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

type ProjectDirectoryFileNode = ProjectDirectoryQuery['directory']['children']['items'][0];
export type ProjectDirectoryDirectory = Exclude<
  ProjectDirectoryFileNode,
  | FileNodeInfo_FileVersion_Fragment
  | FileNodeInfo_File_Fragment
  | FileNodeInfo_FileVersion_Fragment
>;
export type ProjectDirectoryFile = Exclude<
  ProjectDirectoryFileNode,
  FileNodeInfo_Directory_Fragment | FileNodeInfo_FileVersion_Fragment
>;

const ProjectFilesListWrapped: FC = () => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const formatDate = useDateTimeFormatter();
  const fileNameAndExtension = useFileNameAndExtension();
  const fileIcon = useFileNodeIcon();

  const {
    previewState: { dialogState: previewState },
    fileToPreview,
    openFilePreview,
  } = useFileActions();

  const {
    loading: directoryLoading,
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
  });

  const isNotRootDirectory = directoryId !== rootDirectoryId;

  const { data, loading, error } = useProjectDirectoryQuery({
    variables: {
      id: directoryId,
    },
    skip: !directoryId,
  });

  const parents = data?.directory.parents ?? [];
  const breadcrumbsParents = parents.slice(0, -1);

  const directoryIsNotInProject =
    !directoryLoading &&
    isNotRootDirectory &&
    !parents.some((parent) => parent.id === rootDirectoryId);

  const items = directoryIsNotInProject ? [] : data?.directory.children.items;

  interface FileRowData {
    id: FileNodeInfoFragment['id'];
    category: FileNodeInfoFragment['category'];
    name: FileNodeInfoFragment['name'];
    createdAt: string;
    createdBy: string;
    mimeType: File['mimeType'];
    size: number;
    item: FileNodeInfoFragment;
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
      const { id, name, category, createdAt, createdBy } = item;
      const {
        displayFirstName: { value: firstName },
        displayLastName: { value: lastName },
      } = createdBy;

      const row = {
        id,
        category,
        name,
        createdAt: formatDate(createdAt),
        createdBy: `${firstName} ${lastName}`,
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
      title: 'Category',
      field: 'category',
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
            {fileNameAndExtension(name).displayName}
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
        const { category, size } = rowData;
        return category === 'Directory' ? '–' : formatFileSize(Number(size));
      },
    },
    {
      title: '',
      field: 'item',
      render: (rowData: FileRowData) => (
        <ActionsMenu item={rowData.item as File} />
      ),
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
      openFilePreview(item as File);
    }
  };

  return directoryLoading ? null : (
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
        <FileActions />
        <CreateProjectDirectory {...createDirectoryState} />
        <FilePreview file={fileToPreview} {...previewState} />
      </Content>
    </div>
  );
};

export const ProjectFilesList: FC = () => (
  <FileActionsContextProvider>
    <ProjectFilesListWrapped />
  </FileActionsContextProvider>
);
