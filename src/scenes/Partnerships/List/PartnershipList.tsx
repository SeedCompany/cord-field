import {
  Breadcrumbs,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { FC } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { List, useListQuery } from '../../../components/List';
import { PartnershipCard } from '../../../components/PartnershipCard';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { CreatePartnership } from '../Create';
import { EditPartnership } from '../Edit';
import { PartnershipFormFragment } from '../PartnershipForm';
import { ProjectPartnershipsDocument } from './PartnershipList.generated';

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
  item: {
    marginBottom: spacing(2),
  },
}));

export const PartnershipList: FC = () => {
  const classes = useStyles();

  const { projectId = '' } = useParams();
  const { root: data, ...list } = useListQuery(ProjectPartnershipsDocument, {
    variables: { project: projectId },
    listAt: (res) => res.project.partnerships,
  });
  const project = data?.project;
  const partnerships = project?.partnerships;

  const [createDialogState, openCreateDialog] = useDialog();
  const [
    editDialogState,
    openEditDialog,
    partnership,
  ] = useDialog<PartnershipFormFragment>();

  return (
    <div className={classes.root}>
      <Helmet
        title={`Partnerships - ${data?.project.name.value ?? 'A Project'}`}
      />
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <Breadcrumb to={`/projects/${projectId}/partnerships`}>
          Partnerships
        </Breadcrumb>
      </Breadcrumbs>
      <div className={classes.headerContainer}>
        <Typography variant="h2" className={classes.title}>
          Partnerships
        </Typography>
        {partnerships?.canCreate && (
          <Tooltip title="Add Partnership">
            <Fab
              color="error"
              aria-label="add partnership"
              onClick={openCreateDialog}
            >
              <Add />
            </Fab>
          </Tooltip>
        )}
      </div>
      <List
        {...list}
        renderItem={(partnership) => (
          <PartnershipCard
            key={partnership.id}
            partnership={partnership}
            onEdit={() => openEditDialog(partnership)}
            className={classes.item}
          />
        )}
        renderSkeleton={(index) => (
          <PartnershipCard key={index} className={classes.item} />
        )}
      />
      {project && partnership && (
        <EditPartnership
          {...editDialogState}
          partnership={partnership}
          project={project}
        />
      )}
      {project && (
        <CreatePartnership {...createDialogState} project={project} />
      )}
    </div>
  );
};
