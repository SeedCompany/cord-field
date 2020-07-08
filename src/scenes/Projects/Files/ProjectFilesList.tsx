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
import { useParams } from 'react-router-dom';
import { File, FileVersion } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
import {
  useDateFormatter,
  useFileSizeFormatter,
} from '../../../components/Formatters';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { RowData, Table } from '../../../components/Table';
import { useProjectFilesQuery } from './ProjectFiles.generated';

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
  const { projectId } = useParams();
  const formatDate = useDateFormatter();
  const formatFileSize = useFileSizeFormatter();
  const { data, loading, error } = useProjectFilesQuery({
    variables: {
      input: projectId,
    },
  });
  const items = data?.project.rootDirectory.children.items;

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
        const { category, name } = rowData;
        const Icon = icons[category as keyof typeof icons];
        return (
          <span className={classes.fileName}>
            <Icon className={classes.fileIcon} />
            {name}
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
      {error || !items ? (
        <Typography variant="h4">Error fetching Project Files</Typography>
      ) : (
        <>
          {loading ? (
            <Skeleton variant="text" width="20%" />
          ) : (
            <Breadcrumbs>
              <ProjectBreadcrumb data={data?.project} />
              <Breadcrumb to=".">Files</Breadcrumb>
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
