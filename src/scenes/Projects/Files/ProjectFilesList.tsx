import { Breadcrumbs, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ContentContainer } from '../../../components/ContentContainer';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { useProjectFilesQuery } from './ProjectFiles.generated';

const useStyles = makeStyles(({ spacing }) => ({
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
  },
  title: {
    marginRight: spacing(3),
  },
}));

export const ProjectFilesList: FC = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  console.log('projectId', projectId);
  const { data } = useProjectFilesQuery({
    variables: {
      input: projectId,
    },
  });
  console.log('data', data);
  return (
    <ContentContainer>
      <Breadcrumbs>
        <ProjectBreadcrumb data={data?.project} />
        <Breadcrumb to=".">Files</Breadcrumb>
      </Breadcrumbs>
      <div className={classes.headerContainer}>
        <Typography variant="h2" className={classes.title}>
          Files
        </Typography>
      </div>
    </ContentContainer>
  );
};
