import {
  Breadcrumbs,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { DateRange } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { securedDateRange } from '../../../api';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { DataButton } from '../../../components/DataButton';
import { FieldOverviewCard } from '../../../components/FieldOverviewCard';
import { useDateFormatter } from '../../../components/Formatters';
import {
  ChatBubbleIcon,
  OptionsIcon,
  PencilCircledIcon,
  PlantIcon,
} from '../../../components/Icons';
import { Redacted } from '../../../components/Redacted';
import {
  LanguageEngagementDetailFragment,
  ProjectBreadcrumbFragment,
} from './LanguageEngagementDetail.generated';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  main: {
    maxWidth: breakpoints.values.md,
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  header: {
    display: 'flex',
  },
  infoColor: {
    color: palette.info.main,
  },
}));

interface LanguageEngagementDetailProps {
  engagement: LanguageEngagementDetailFragment;
  project: ProjectBreadcrumbFragment;
}

export const LanguageEngagementDetail: FC<LanguageEngagementDetailProps> = ({
  project,
  engagement,
}) => {
  const classes = useStyles();

  const date = securedDateRange(engagement.startDate, engagement.endDate);
  const formatDate = useDateFormatter();

  return (
    <div className={classes.root}>
      <main className={classes.main}>
        <Breadcrumbs>
          <Breadcrumb to={`/projects`}>Projects</Breadcrumb>
          <Breadcrumb to={`/projects/${project.id}`}>
            {project.name.value ?? <Skeleton width={200} />}
          </Breadcrumb>
          <Breadcrumb
            to={`/projects/${project.id}/engagements/${engagement.id}`}
          >
            {engagement.language.value?.name.value}
          </Breadcrumb>
        </Breadcrumbs>
        <Typography variant="h2" className={classes.header}>
          {engagement.language.value?.name.canRead ? (
            engagement.language.value?.name.value
          ) : (
            <Redacted
              info="You do not have permission to view language engagement's name"
              width="50%"
            />
          )}
          {engagement.language.value?.name.canEdit && (
            <IconButton color="primary" aria-label="edit language engagement">
              <PencilCircledIcon />
            </IconButton>
          )}
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <DataButton
              startIcon={<DateRange className={classes.infoColor} />}
              secured={date}
              redacted="You do not have permission to view start/end dates"
              children={formatDate.range}
              empty="Start - End"
            />
          </Grid>
          {/* TODO: implement when status fixed
           <Grid item>
            <DataButton>{displayStatus(engagement.status)}</DataButton>
          </Grid> */}
        </Grid>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Growth Plan Complete Date"
              viewLabel="Edit Complete Date"
              data={{
                value: formatDate(engagement.completeDate.value),
                // updatedAt: engagement.modifiedAt.value,
                to: '/home',
              }}
              icon={PlantIcon}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Disbursement Complete Date"
              viewLabel="Edit Complete Date"
              data={{
                value: formatDate(engagement.disbursementCompleteDate.value),
                // updatedAt: engagement.modifiedAt.value,
                to: '/home',
              }}
              icon={ChatBubbleIcon}
            />
          </Grid>
          <Grid item xs={6}>
            <FieldOverviewCard
              title="Communications Complete Date"
              viewLabel="Edit Complete Date"
              data={{
                value: formatDate(engagement.communicationsCompleteDate.value),
                // updatedAt: engagement.modifiedAt.value,
                to: '/home',
              }}
              icon={OptionsIcon}
            />
          </Grid>
        </Grid>
        <Typography variant="h4">Products</Typography>
        Product list goes here when ready
      </main>
    </div>
  );
};
