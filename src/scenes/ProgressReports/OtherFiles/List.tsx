import { useQuery } from '@apollo/client';
import { Box, Breadcrumbs, makeStyles, useTheme } from '@material-ui/core';
import { Publish } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Helmet } from 'react-helmet-async';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { Error } from '../../../components/Error';
import {
  FileActionsPopup as ActionsMenu,
  FileAction,
  FileActionsContextProvider,
  getPermittedFileActions,
  isFileVersion,
  useFileActions,
} from '../../../components/files/FileActions';
import { FileNodeInfo_Directory_Fragment as Directory } from '../../../components/files/files.graphql';
import { fileIcon } from '../../../components/files/fileTypes';
import {
  formatFileSize,
  parseFileNameAndExtension,
  useDateTimeFormatter,
} from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { getLabel } from '../../../components/PeriodicReports/ReportLabel';
import { Table } from '../../../components/Table';
import { DropzoneOverlay } from '../../../components/Upload';
import { isTypename } from '../../../util';
import { FileOrDirectory } from '../../Projects/Files/util';
import { ProjectReportDirectoryDocument } from './OtherFiles.graphql';
import { OtherFilesRow } from './Row';
import { usePeriodicReport } from './usePeriodicReport';
import { useUploadReportFiles } from './useUploadOtherFiles';

export const isDirectory = isTypename<Directory>('Directory');

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

const OtherFilesListWrapped: FC = () => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const formatDate = useDateTimeFormatter();

  const { openFilePreview } = useFileActions();

  const {
    loading: reportLoading,
    report,
    reportDirectoryId,
    reportsUrl,
    reportIntervalUrl,
  } = usePeriodicReport();

  const uploadReportFiles = useUploadReportFiles();

  const handleDrop = (files: File[]) => {
    uploadReportFiles({ files, parentId: reportDirectoryId });
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
    disabled: !reportDirectoryId,
  });

  const { data, loading, error } = useQuery(ProjectReportDirectoryDocument, {
    variables: {
      id: reportDirectoryId,
    },
    skip: !reportDirectoryId,
  });

  // Don't wait for data to load table js code
  useEffect(() => Table.preload(), []);

  const items = data?.directory.children.items;

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
        const permittedActions = getPermittedFileActions(true, true);
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
              uploadReportFiles({
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
    const { item } = rowData;
    if (!isDirectory(item)) {
      openFilePreview(item);
    }
  };

  return reportLoading ? null : (
    <div className={classes.dropzone} {...getRootProps()}>
      <Helmet
        title={`Files - ${
          report ? report.otherFiles.value?.name ?? 'Other Files' : '...'
        }`}
      />
      <input {...getInputProps()} name="files_list_uploader" />
      <DropzoneOverlay
        isDragActive={isDragActive}
        message="Drop files to start uploading"
      />
      <ContentContainer>
        {error || (!loading && !items) || !report ? (
          <Error show error={error}>
            Error loading report's files
          </Error>
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
                  <Breadcrumb to={reportsUrl}>{report.type} Reports</Breadcrumb>
                  <Breadcrumb to={reportIntervalUrl}>
                    {getLabel(report.start, report.end)}
                  </Breadcrumb>
                  <Breadcrumb to=".">Files</Breadcrumb>
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
                  Row: OtherFilesRow,
                }}
                actions={[
                  {
                    icon: Publish,
                    tooltip: 'Upload Files',
                    isFreeAction: true,
                    onClick: openFileBrowser,
                  },
                ]}
              />
              {/* <NodePreviewLayer /> */}
            </section>
          </>
        )}
      </ContentContainer>
    </div>
  );
};

export const OtherFilesList: FC = () => (
  <FileActionsContextProvider>
    <OtherFilesListWrapped />
  </FileActionsContextProvider>
);
