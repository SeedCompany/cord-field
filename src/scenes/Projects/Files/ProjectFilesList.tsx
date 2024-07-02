import { useQuery } from '@apollo/client';
import { CreateNewFolder, Publish } from '@mui/icons-material';
import {
  Box,
  Breadcrumbs,
  Card,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  DataGridPro as DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbarContainer,
  GridToolbarProps,
} from '@mui/x-data-grid-pro';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
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
import {
  getDirectoryComponents,
  getFileComponents,
} from '../../../components/files/fileTypes';
import {
  formatFileSize,
  FormattedDateTime,
  parseFileNameAndExtension,
} from '../../../components/Formatters';
import { IconButton } from '../../../components/IconButton';
import { ContentContainer } from '../../../components/Layout';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { DropOverlay } from '../../../components/Upload/DropOverlay';
import { useProjectId } from '../useProjectId';
import { CreateProjectDirectory } from './CreateProjectDirectory';
import { DirectoryBreadcrumb } from './DirectoryBreadcrumb';
import { FileRow as FileRowComponent } from './FileRow';
import { NodePreviewLayer } from './NodePreviewLayer';
import { ProjectDirectoryDocument } from './ProjectFiles.graphql';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';
import { useUploadProjectFiles } from './useUploadProjectFiles';
import { FileRowData as FileRow, isDirectory } from './util';

const useStyles = makeStyles()(({ palette, spacing, breakpoints }) => ({
  dropzone: {
    overflowY: 'auto',
    width: '100%',
    height: '100%',
  },
  tableWrapper: {
    margin: spacing(4, 4, 4, 0),
    maxWidth: breakpoints.values.md,
  },
  fileName: {
    display: 'flex',
    alignItems: 'center',
  },
  fileIcon: {
    color: palette.action.active,
    marginRight: spacing(0.5),
  },
}));

const ProjectFilesListWrapped = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { projectUrl } = useProjectId();

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

  const parents = data?.directory.parents;
  const breadcrumbsParents = parents?.slice(0, -1) ?? [];

  const directoryIsNotInProject =
    !directoryLoading &&
    isNotRootDirectory &&
    parents &&
    !parents.some((parent) => parent.id === rootDirectoryId);

  const items = directoryIsNotInProject ? [] : data?.directory.children.items;

  const rowData = (items ?? []).flatMap<FileRow>((item) =>
    isFileVersion(item) ? [] : { ...item, parent: data!.directory }
  );

  const columns: Array<GridColDef<FileRow>> = [
    {
      headerName: 'Name',
      field: 'name',
      flex: 1,
      renderCell: ({ row, value }) => {
        const { Icon } = isDirectory(row)
          ? getDirectoryComponents()
          : getFileComponents(row.mimeType);
        return (
          <span className={classes.fileName}>
            <Icon className={classes.fileIcon} />
            {parseFileNameAndExtension(value).displayName}
          </span>
        );
      },
    },
    {
      headerName: 'Modified',
      field: 'modifiedAt',
      width: 150,
      valueGetter: (_, row) =>
        row.__typename === 'File' ? row.modifiedAt : row.createdAt,
      renderCell: ({ value }) => <FormattedDateTime date={value} />,
    },
    {
      headerName: 'Modified By',
      field: 'modifiedBy',
      width: 150,
      valueGetter: (_, row) =>
        row.__typename === 'File'
          ? row.modifiedBy.fullName
          : row.createdBy.fullName,
    },
    {
      headerName: 'File Size',
      field: 'size',
      valueGetter: (_, row) => (isDirectory(row) ? undefined : row.size),
      renderCell: ({ row: { type }, value: size }) =>
        type === 'Directory' ? '–' : formatFileSize(size),
    },
    {
      headerName: '',
      field: 'item',
      width: 55,
      align: 'center',
      renderCell: ({ row }) => {
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
            IconButtonProps={{ size: 'small' }}
            actions={isDirectory(row) ? directoryActions : permittedActions}
            item={row}
            onVersionUpload={(files) =>
              uploadProjectFiles({
                action: 'version',
                files,
                parentId: row.id,
              })
            }
          />
        );
      },
      sortable: false,
    },
  ];

  const handleRowClick = ({ row }: GridRowParams<FileRow>) => {
    if (isDirectory(row)) {
      navigate(`${projectUrl}/files/${row.id}`);
    } else {
      openFilePreview(row);
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
                    to={`${projectUrl}/files`}
                  />
                  {breadcrumbsParents.map((parent) => (
                    <DirectoryBreadcrumb
                      key={parent.id}
                      id={parent.id}
                      name={parent.name}
                      to={`${projectUrl}/files/${parent.id}`}
                    />
                  ))}
                  {isNotRootDirectory && (
                    <DirectoryBreadcrumb
                      name={data?.directory.name}
                      to={`${projectUrl}/files/${directoryId}`}
                    />
                  )}
                </Breadcrumbs>
              </Box>
            )}
            <section className={classes.tableWrapper}>
              <Card css={{ position: 'relative' }}>
                <DropOverlay isDragActive={isDragActive}>
                  Drop files to start uploading
                </DropOverlay>
                <DataGrid
                  loading={loading}
                  rows={rowData}
                  columns={columns}
                  onRowClick={handleRowClick}
                  slots={{
                    row: FileRowComponent,
                    toolbar: FilesToolbar,
                    footer: () => null,
                  }}
                  slotProps={{
                    toolbar: {
                      onUploadFiles: openFileBrowser,
                      onCreateFolder: createDirectory,
                    } satisfies FileToolbarProps,
                  }}
                  localeText={{
                    noRowsLabel: 'No files',
                  }}
                  disableColumnMenu
                  autoHeight
                  sx={{
                    '& .MuiDataGrid-row': { cursor: 'pointer' },
                    '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
                      '&:focus, &:focus-within': { outline: 'none' },
                    },
                  }}
                />
              </Card>
              <NodePreviewLayer />
            </section>
          </>
        )}
        <CreateProjectDirectory {...createDirectoryState} />
      </ContentContainer>
    </div>
  );
};

interface FileToolbarProps {
  onUploadFiles: () => void;
  onCreateFolder: () => void;
}
const FilesToolbar = ({
  onUploadFiles,
  onCreateFolder,
}: GridToolbarProps & Partial<FileToolbarProps>) => (
  <GridToolbarContainer>
    <div css={{ flex: 1 }} />
    <Tooltip title="Upload Files">
      <IconButton onClick={onUploadFiles}>
        <Publish />
      </IconButton>
    </Tooltip>
    <Tooltip title="Create Folder">
      <IconButton onClick={onCreateFolder}>
        <CreateNewFolder />
      </IconButton>
    </Tooltip>
  </GridToolbarContainer>
);

export const ProjectFilesList = () => (
  <FileActionsContextProvider>
    <ProjectFilesListWrapped />
  </FileActionsContextProvider>
);
