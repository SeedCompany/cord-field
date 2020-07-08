import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { DateTime } from 'luxon';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { File, FileVersion } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer as Content } from '../../../components/ContentContainer';
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
}));

export const ProjectFilesList: FC = () => {
  const classes = useStyles();
  const { projectId } = useParams();
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
      title: 'Name',
      field: 'name',
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
    },
  ];

  const rowData =
    items?.reduce((rows: RowData[], item) => {
      const isDirectory = item.type === 'Directory';
      const { id, name, createdAt, createdBy } = item;
      const {
        displayFirstName: { value: firstName },
        displayLastName: { value: lastName },
      } = createdBy;

      const row = {
        id,
        name,
        createdAt: DateTime.fromISO(String(createdAt)).toLocaleString(),
        createdBy: `${firstName} ${lastName}`,
        size: isDirectory ? '–' : (item as File | FileVersion).size,
      };
      return rows.concat(row);
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
                <Skeleton variant="text" width="10%" />
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
