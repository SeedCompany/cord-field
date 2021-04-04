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
import { PlanChangeCard } from '../../../../components/PlanChangeCard';
import { ProjectBreadcrumb } from '../../../../components/ProjectBreadcrumb';
import { ProjectMemberCard } from '../../../../components/ProjectMemberCard';
import { CreatePlanChange } from '../Create/CreatePlanChange';
import { PlanChangesDocument } from './PlanChanges.generated';

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

export const PlanChangesList: FC = () => {
  const classes = useStyles();
  const { projectId = '' } = useParams();
  const { root: data, ...list } = useListQuery(PlanChangesDocument, {
    listAt: (res) => res.project.changes,
    variables: {
      project: projectId,
    },
  });

  const [createPlanChangeDialogState, openCreatePlanChangeDialog] = useDialog();

  return (
    <div className={classes.root}>
      <Helmet
        title={`Plan Changes - ${data?.project.name.value ?? 'A Project'}`}
      />
      <Breadcrumbs>
        <ProjectBreadcrumb data={data?.project} />
        <Breadcrumb to=".">Plan Changes</Breadcrumb>
      </Breadcrumbs>
      <div className={classes.headerContainer}>
        <Typography variant="h2" className={classes.title}>
          Plan Changes
        </Typography>
        {(!list.data || list.data.canCreate) && (
          <Tooltip title="Create Plan Change">
            <Fab
              color="error"
              aria-label="Create Plan Change"
              loading={!list.data}
              onClick={openCreatePlanChangeDialog}
            >
              <Add />
            </Fab>
          </Tooltip>
        )}
        {data && (
          <CreatePlanChange
            {...createPlanChangeDialogState}
            project={data.project}
          />
        )}
      </div>
      {list.data?.canRead === false ? (
        <Typography>
          Sorry, you don't have permission to view this project's plan changes.
        </Typography>
      ) : (
        <List
          {...list}
          spacing={3}
          renderItem={(planChange) => (
            <PlanChangeCard planChange={planChange} />
          )}
          renderSkeleton={<ProjectMemberCard />}
        />
      )}
    </div>
  );
};
