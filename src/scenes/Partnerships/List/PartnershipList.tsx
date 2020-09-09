import {
  Breadcrumbs,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Merge } from 'type-fest';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { useDialog } from '../../../components/Dialog';
import { Fab } from '../../../components/Fab';
import { PartnershipCard } from '../../../components/PartnershipCard';
import { PartnershipCardFragment } from '../../../components/PartnershipCard/PartnershipCard.generated';
import { ProjectBreadcrumb } from '../../../components/ProjectBreadcrumb';
import { listOrPlaceholders } from '../../../util';
import { EditPartnership } from '../Edit';
import { PartnershipFormFragment } from '../PartnershipForm';
import { useProjectPartnershipsQuery } from './PartnershipList.generated';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
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

  const { projectId } = useParams();
  const { data } = useProjectPartnershipsQuery({
    variables: { input: projectId },
  });
  const project = data?.project;
  const partnerships = project?.partnerships;

  const [dialogState, openDialog, partnership] = useDialog<
    Merge<PartnershipCardFragment, PartnershipFormFragment>
  >();

  return (
    <div className={classes.root}>
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
            <Fab color="error" aria-label="add partnership">
              <Add />
            </Fab>
          </Tooltip>
        )}
      </div>
      {listOrPlaceholders(partnerships?.items, 5).map((item, index) => (
        <PartnershipCard
          key={item?.id ?? index}
          partnership={item}
          onEdit={() => item && openDialog(item)}
          className={classes.item}
        />
      ))}
      {partnership && (
        <EditPartnership {...dialogState} partnership={partnership} />
      )}
    </div>
  );
};
