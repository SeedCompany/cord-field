import {
  Box,
  Breadcrumbs,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import { File as CFFile, FileVersion } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useDialog } from '../../../components/Dialog';
import {
  FileActionsPopup as ActionsMenu,
  DeleteFile,
  FileActionHandler,
  FileActionItem,
  RenameFile,
} from '../../../components/files/FileActionsMenu';
import {
  useDownloadFile,
  useFileNameAndExtension,
  useFileNodeIcon,
} from '../../../components/files/hooks';
// import { FilePreview } from '../../../components/FilePreview';
import {
  formatFileSize,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { Table } from '../../../components/Table';
import { FileCreateActions } from './FileCreateActions';
import { FileVersions } from './FileVersions';
import {
  FileNodeInfoFragment,
  useProjectDirectoryQuery,
} from './ProjectFiles.generated';
import { UploadProjectFileVersion } from './UploadProjectFileVersion';
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
    textDecoration: 'none',
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

export const ProjectFilesList: FC = () => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const formatDate = useDateTimeFormatter();
  const downloadFile = useDownloadFile();
  const fileNameAndExtension = useFileNameAndExtension();
  const fileIcon = useFileNodeIcon();

  const {
    project,
    directoryId,
    rootDirectoryId,
  } = useProjectCurrentDirectory();

  const handleFilesDrop = useUploadProjectFiles(directoryId);

  const [renameFileState, renameFile, itemToRename] = useDialog<
    FileActionItem
  >();
  const [fileVersionState, showVersions, fileVersionToView] = useDialog<
    CFFile
  >();
  const [newVersionState, createNewVersion, fileToVersion] = useDialog<
    CFFile
  >();
  const [deleteFileState, deleteFile, itemToDelete] = useDialog<
    FileActionItem
  >();
  // const [filePreviewState, previewFile, fileToPreview] = useDialog<CFFile>();

  const actions = {
    rename: (item: FileActionItem) => renameFile(item as any),
    download: (item: FileActionItem) => downloadFile(item as CFFile),
    history: (item: FileActionItem) => showVersions(item as CFFile),
    'new version': (item: FileActionItem) => createNewVersion(item as CFFile),
    delete: (item: FileActionItem) => deleteFile(item as any),
  };

  const handleFileActionClick: FileActionHandler = (item, action) => {
    actions[action](item);
  };
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
    isNotRootDirectory &&
    !parents.some((parent) => parent.id === rootDirectoryId);

  const items = directoryIsNotInProject ? [] : data?.directory.children.items;

  interface FileRowData {
    id: FileNodeInfoFragment['id'];
    category: FileNodeInfoFragment['category'];
    name: FileNodeInfoFragment['name'];
    createdAt: string;
    createdBy: string;
    size: number;
    item: FileNodeInfoFragment;
  }

  const rowData =
    items?.reduce((rows: FileRowData[], item) => {
      const isDirectory = item.type === 'Directory';
      const isFileVersion = item.type === 'FileVersion';
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
        size: isDirectory ? 0 : (item as File | FileVersion).size,
        item,
      };
      return isFileVersion ? rows : rows.concat(row);
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
      title: 'Name',
      field: 'name',
      render: (rowData: FileRowData) => {
        const { category, name } = rowData;
        const Icon = fileIcon(category);
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
        <ActionsMenu
          item={rowData.item as any}
          onFileAction={handleFileActionClick}
        />
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
    const { category, id, item } = rowData;
    const isDirectory = category === 'Directory';
    if (isDirectory) {
      navigate(`/projects/${projectId}/files/${id}`);
    } else {
      console.log('Preview file', item.id);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFilesDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className={classes.dropzone} {...getRootProps()}>
      {isDragActive && (
        <div className={classes.dropContainer}>
          <input {...getInputProps()} name="files_list_uploader" />
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
                  toolbarContents={
                    <div className={classes.toolbarContainer}>
                      <FileCreateActions />
                    </div>
                  }
                />
              )}
            </section>
          </>
        )}
        <RenameFile item={itemToRename} {...renameFileState} />
        <DeleteFile item={itemToDelete} {...deleteFileState} />
        <FileVersions file={fileVersionToView} {...fileVersionState} />
        <UploadProjectFileVersion file={fileToVersion} {...newVersionState} />
        {/* <FilePreview file={fileToPreview} {...filePreviewState} /> */}
      </Content>
    </div>
  );
};
