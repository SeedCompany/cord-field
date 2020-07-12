import {
  Box,
  Breadcrumbs,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import {
  Description as DescriptionIcon,
  Folder as FolderIcon,
  GraphicEq as GraphicEqIcon,
  Image as ImageIcon,
  InsertDriveFile as InsertDriveFileIcon,
  TableChart as TableChartIcon,
  VideoLibrary as VideoLibraryIcon,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { File, FileVersion } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import { useDialog } from '../../../components/Dialog';
import {
  FileActionsPopup as ActionsMenu,
  FileActionHandler,
  FileActionItem,
  RenameFile,
} from '../../../components/FileActionsMenu';
import {
  useDateFormatter,
  useFileSizeFormatter,
} from '../../../components/Formatters';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { RowData, Table } from '../../../components/Table';
import { FileCreateActions } from './FileCreateActions';
import { useProjectDirectoryQuery } from './ProjectFiles.generated';
import { useProjectCurrentDirectory } from './useProjectCurrentDirectory';

const useStyles = makeStyles(({ spacing }) => ({
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
  },
  title: {
    marginRight: spacing(3),
  },
  tableWrapper: {
    marginTop: spacing(4),
  },
  folderLink: {
    color: 'inherit',
    textDecoration: 'none',
  },
  fileName: {
    display: 'flex',
    alignItems: 'center',
  },
  fileIcon: {
    marginRight: spacing(0.5),
  },
}));

const icons = {
  Audio: GraphicEqIcon,
  Directory: FolderIcon,
  Document: DescriptionIcon,
  Image: ImageIcon,
  Other: InsertDriveFileIcon,
  Spreadsheet: TableChartIcon,
  Video: VideoLibraryIcon,
};

export const ProjectFilesList: FC = () => {
  const classes = useStyles();
  const { spacing } = useTheme();
  const { projectId } = useParams();
  const formatDate = useDateFormatter();
  const formatFileSize = useFileSizeFormatter();

  const [item, setItem] = useState<FileActionItem | null>(null);

  const [renameFileState, renameFile] = useDialog();

  const actions = {
    rename: () => renameFile(),
    download: () => console.log('Download File'),
    history: () => console.log('File History'),
    delete: () => console.log('Delete File'),
  };

  const handleFileActionClick: FileActionHandler = (item, action) => {
    setItem(item);
    actions[action]();
  };

  const {
    project,
    directoryId,
    rootDirectoryId,
  } = useProjectCurrentDirectory();
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
      render: (rowData: RowData) => {
        const { category, id, name } = rowData;
        const Icon = icons[category as keyof typeof icons];
        const isDirectory = category === 'Directory';
        const content = (
          <span className={classes.fileName}>
            <Icon className={classes.fileIcon} />
            {name}
          </span>
        );
        return isDirectory ? (
          <Link
            className={classes.folderLink}
            to={`/projects/${projectId}/folders/${id}`}
          >
            {content}
          </Link>
        ) : (
          content
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
      render: (rowData: RowData) => {
        const { category, size } = rowData;
        return category === 'Directory' ? '–' : formatFileSize(Number(size));
      },
    },
    {
      title: '',
      field: 'item',
      render: (rowData: RowData) => (
        <ActionsMenu item={rowData.item} onFileAction={handleFileActionClick} />
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

  const rowData =
    items?.reduce((rows: RowData[], item) => {
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

  return (
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
                    to={`/projects/${projectId}/folders/${parent.id}`}
                  >
                    {parent.name}
                  </Breadcrumb>
                ))}
                {isNotRootDirectory && (
                  <Breadcrumb
                    to={`/projects/${projectId}/folders/${directoryId}`}
                  >
                    {data?.directory.name}
                  </Breadcrumb>
                )}
              </Breadcrumbs>
              <FileCreateActions />
            </Box>
          )}
          <header className={classes.headerContainer}>
            {loading ? (
              <>
                <Skeleton variant="text" width="20%" />
              </>
            ) : (
              <Typography variant="h2" className={classes.title}>
                Files
              </Typography>
            )}
          </header>
          <section className={classes.tableWrapper}>
            {loading ? (
              <Skeleton variant="rect" width="100%" height={200} />
            ) : (
              <Table data={rowData} columns={columns} />
            )}
          </section>
        </>
      )}
      <RenameFile item={item} {...renameFileState} />
    </Content>
  );
};
