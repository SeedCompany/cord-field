import { Add } from '@mui/icons-material';
import { Breadcrumbs, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { useDialog } from '../../../../components/Dialog';
import { Fab } from '../../../../components/Fab';
import { List, useListQuery } from '../../../../components/List';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProjectChangeRequestListItem } from '../../../../components/ProjectChangeRequestListItem';
import { useProjectId } from '../../useProjectId';
import { CreateProjectChangeRequest } from '../Create';
import { ProjectChangeRequestListDocument as ChangeRequestList } from './ProjectChangeRequestList.graphql';

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
  },
  main: {
    padding: spacing(4),
    maxWidth: breakpoints.values.sm,
  },
  headerContainer: {
    margin: spacing(3, 0),
    display: 'flex',
  },
  title: {
    marginRight: spacing(3),
  },
}));

export const ProjectChangeRequestList = () => {
  const { classes } = useStyles();
  const { projectId, changesetId } = useProjectId();
  const { root: data, ...list } = useListQuery(ChangeRequestList, {
    listAt: (res) => res.project.changeRequests,
    variables: {
      project: projectId,
      changeset: changesetId,
    },
  });

  const [createState, openCreateDialog] = useDialog();

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Helmet
          title={`Change Requests - ${data?.project.name.value ?? 'A Project'}`}
        />
        <Breadcrumbs>
          <ProjectBreadcrumb data={data?.project} />
          <Breadcrumb to=".">Change Requests</Breadcrumb>
        </Breadcrumbs>
        <div className={classes.headerContainer}>
          <Typography variant="h2" className={classes.title}>
            Change Requests
          </Typography>
          {(!list.data || list.data.canCreate) && (
            <Tooltip title="Create Change Request">
              <Fab
                color="error"
                loading={!list.data}
                onClick={openCreateDialog}
              >
                <Add />
              </Fab>
            </Tooltip>
          )}
          {data && (
            <CreateProjectChangeRequest
              {...createState}
              project={data.project}
            />
          )}
        </div>
        {list.data?.canRead === false ? (
          <Typography>
            Sorry, you don't have permission to view this project's change
            requests.
          </Typography>
        ) : (
          <List
            {...list}
            spacing={3}
            renderItem={(changeRequest) => (
              <ProjectChangeRequestListItem data={changeRequest} />
            )}
            renderSkeleton={<ProjectChangeRequestListItem />}
          />
        )}
      </main>
    </div>
  );
};
