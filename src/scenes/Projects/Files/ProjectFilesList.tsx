import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import {
  Description,
  Folder,
  GraphicEq,
  Image,
  InsertDriveFile,
  TableChart,
  VideoLibrary,
} from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import { File, FileVersion } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import {
  useDateFormatter,
  useFileSizeFormatter,
} from '../../../components/Formatters';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { RowData, Table } from '../../../components/Table';
import {
  useProjectDirectoryQuery,
  useProjectRootDirectoryQuery,
} from './ProjectFiles.generated';

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
  Audio: GraphicEq,
  Directory: Folder,
  Document: Description,
  Image: Image,
  Other: InsertDriveFile,
  Spreadsheet: TableChart,
  Video: VideoLibrary,
};

export const ProjectFilesList: FC = () => {
  const classes = useStyles();
  const { projectId, folderId } = useParams();
  const formatDate = useDateFormatter();
  const formatFileSize = useFileSizeFormatter();
  const { data: projectRootData } = useProjectRootDirectoryQuery({
    variables: {
      id: projectId,
    },
  });

  const rootDirectoryId = projectRootData?.project.rootDirectory.id;
  const directoryId = folderId ?? rootDirectoryId ?? '';
  const isNotRootDirectory = directoryId !== rootDirectoryId;

  const { data: directoryData, loading, error } = useProjectDirectoryQuery({
    variables: {
      id: directoryId,
    },
    skip: !directoryId,
  });

  const parents = directoryData?.directory.parents ?? [];
  const breadcrumbsParents = parents.slice(0, -1);

  const directoryIsNotInProject =
    isNotRootDirectory &&
    !parents.some((parent) => parent.id === rootDirectoryId);

  const items = directoryIsNotInProject
    ? []
    : directoryData?.directory.children.items;

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
            <Breadcrumbs>
              <ProjectBreadcrumb data={projectRootData?.project} />
              <Breadcrumb to={`/projects/${projectId}/files`}>Files</Breadcrumb>
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
                  {directoryData?.directory.name}
                </Breadcrumb>
              )}
            </Breadcrumbs>
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
    </Content>
  );
};
