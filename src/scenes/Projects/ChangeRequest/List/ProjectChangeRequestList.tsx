import {
  Breadcrumbs,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../../components/Breadcrumb';
import { useDialog } from '../../../../components/Dialog';
import { Fab } from '../../../../components/Fab';
import { List, useListQuery } from '../../../../components/List';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProjectChangeRequestListItem } from '../../../../components/ProjectChangeRequestListItem';
import { CreateProjectChangeRequest } from '../Create';
import {
  UpdatePlanChangeFormParams,
  UpdateProjectChangeRequest,
} from '../Update';
import { ProjectChangeRequestListDocument as ChangeRequestList } from './ProjectChangeRequestList.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'auto',
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

export const ProjectChangeRequestList: FC = () => {
  const classes = useStyles();
  const { projectId = '' } = useParams();
  const { root: data, ...list } = useListQuery(ChangeRequestList, {
    listAt: (res) => res.project.changeRequests,
    variables: {
      project: projectId,
    },
  });

  const [createPlanChangeDialogState, openCreatePlanChangeDialog] = useDialog();

  const [updateDialogState, openUpdateDialog, requestBeingUpdated] =
    useDialog<UpdatePlanChangeFormParams>();

  return (
    <div className={classes.root}>
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
              onClick={openCreatePlanChangeDialog}
            >
              <Add />
            </Fab>
          </Tooltip>
        )}
        {data && (
          <CreateProjectChangeRequest
            {...createPlanChangeDialogState}
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
            <ProjectChangeRequestListItem
              data={changeRequest}
              onEdit={() =>
                openUpdateDialog({
                  project: data!.project,
                  changeRequest,
                })
              }
            />
          )}
          renderSkeleton={<ProjectChangeRequestListItem />}
        />
      )}
      {requestBeingUpdated && (
        <UpdateProjectChangeRequest
          {...updateDialogState}
          {...requestBeingUpdated}
        />
      )}
    </div>
  );
};
