import { Add } from '@mui/icons-material';
import { Breadcrumbs, Tooltip, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { List, useListQuery } from '../../../components/List';
import { PartnershipCard } from '../../../components/PartnershipCard';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { useProjectId } from '../../Projects/useProjectId';
import { CreatePartnership } from '../Create';
import { EditPartnership } from '../Edit';
import { PartnershipFormFragment } from '../PartnershipForm';
import { ProjectPartnershipsDocument } from './PartnershipList.graphql';

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
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

export const PartnershipList = () => {
  const { classes } = useStyles();

  const { projectId, changesetId, projectUrl } = useProjectId();
  const { root: data, ...list } = useListQuery(ProjectPartnershipsDocument, {
    variables: { project: projectId, changeset: changesetId },
    listAt: (res) => res.project.partnerships,
    changesetRemovedItems: (obj): obj is PartnershipFormFragment =>
      obj.__typename === 'Partnership',
  });
  const project = data?.project;
  const partnerships = project?.partnerships;

  const [createDialogState, openCreateDialog] = useDialog();
  const [editDialogState, openEditDialog, partnership] =
    useDialog<PartnershipFormFragment>();

  return (
    <div className={classes.root}>
      <Helmet
        title={`Partnerships - ${data?.project.name.value ?? 'A Project'}`}
      />
      <Breadcrumbs>
        <ProjectBreadcrumb data={project} />
        <Breadcrumb to={`${projectUrl}/partnerships`}>Partnerships</Breadcrumb>
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
            partnership={partnership}
            onEdit={() => openEditDialog(partnership)}
          />
        )}
        renderSkeleton={<PartnershipCard />}
      />
      {project && partnership && (
        <EditPartnership {...editDialogState} partnership={partnership} />
      )}
      {project && (
        <CreatePartnership {...createDialogState} project={project} />
      )}
    </div>
  );
};
