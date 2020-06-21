import {
  Breadcrumbs,
  makeStyles,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { noop } from 'ts-essentials';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { Fab } from '../../../components/Fab';
import { PartnershipCard } from '../../../components/PartnershipCard';
import { listOrPlaceholders } from '../../../util';
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

  return (
    <div className={classes.root}>
      <Breadcrumbs>
        <Breadcrumb to={`/projects/${projectId}`}>
          {project?.name?.value ?? <Skeleton width={200} />}
        </Breadcrumb>
        <Breadcrumb to={`/projects/${projectId}/partnerships`}>
          Partnerships
        </Breadcrumb>
      </Breadcrumbs>
      <div className={classes.headerContainer}>
        <Typography variant="h2" className={classes.title}>
          Partnerships
        </Typography>
        {partnerships?.canCreate && (
          <Tooltip arrow title="Add Partnership">
            <Fab size="small" color="error" aria-label="add partnership">
              <Add />
            </Fab>
          </Tooltip>
        )}
      </div>
      {listOrPlaceholders(partnerships?.items, 5).map((item, index) => (
        <PartnershipCard
          key={item?.id ?? index}
          partnership={item}
          onEdit={noop}
          className={classes.item}
        />
      ))}
    </div>
  );
};
