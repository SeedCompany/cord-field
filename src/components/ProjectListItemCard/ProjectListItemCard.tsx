import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import * as React from 'react';
import { ProjectStatusLabels } from '~/api/schema';
import { ProjectListQueryVariables } from '../../scenes/Projects/List/projects.graphql';
import { getProjectUrl } from '../../scenes/Projects/useProjectId';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { FormattedDate } from '../Formatters';
import { PresetInventoryIconFilled } from '../Icons';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { TogglePinButton } from '../TogglePinButton';
import { ProjectListItemFragment } from './ProjectListItem.graphql';

const useStyles = makeStyles(({ breakpoints, spacing }) => {
  const cardWidth = breakpoints.values.sm;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
      position: 'relative',
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftContent: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    rightContent: {
      flex: 1,
      textAlign: 'right',
      marginLeft: spacing(2),
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    pin: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    presetInventory: {
      verticalAlign: 'bottom',
      marginLeft: spacing(1),
    },
    engagementCount: {
      flex: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    sensitivity: {
      marginBottom: spacing(1),
    },
    skeletonRight: {
      marginLeft: 'auto',
    },
  };
});

export interface ProjectListItemCardProps {
  project?: ProjectListItemFragment;
  className?: string;
}

export const ProjectListItemCard = ({
  project,
  className,
}: ProjectListItemCardProps) => {
  const classes = useStyles();
  const location = project?.primaryLocation.value?.name.value;

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink
        disabled={!project}
        to={project ? getProjectUrl(project) : ''}
        className={classes.card}
      >
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justify="space-between"
            spacing={1}
            className={classes.leftContent}
          >
            <Grid item>
              <Typography variant="h4">
                {!project ? <Skeleton variant="text" /> : project.name.value}
                {project?.presetInventory.value && (
                  <PresetInventoryIconFilled
                    color="action"
                    className={classes.presetInventory}
                    aria-label="preset inventory"
                  />
                )}
              </Typography>
            </Grid>
            <DisplaySimpleProperty
              loading={!project}
              label="Project ID"
              value={project?.id}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <DisplaySimpleProperty
              loading={!project}
              label="Department ID"
              value={project?.departmentId.value}
              wrap={(node) => <Grid item>{node}</Grid>}
            />
            <Grid item>
              <Typography variant="body2" color="primary">
                {!project ? (
                  <Skeleton variant="text" />
                ) : location ? (
                  location
                ) : (
                  <>&nbsp;</>
                )}
              </Typography>
            </Grid>
            <Grid item>
              <Sensitivity
                value={project?.sensitivity}
                loading={!project}
                className={classes.sensitivity}
              />
            </Grid>
            <Grid item>
              {!project ? (
                <Skeleton variant="text" width="50%" />
              ) : (
                <DisplaySimpleProperty
                  label="Status"
                  value={ProjectStatusLabels[project.projectStatus]}
                />
              )}
            </Grid>
          </Grid>
          <div className={classes.rightContent}>
            <DisplaySimpleProperty aria-hidden="true" />
            <div className={classes.engagementCount}>
              <Typography variant="h1">
                {!project ? (
                  <Skeleton
                    variant="text"
                    width="1ch"
                    className={classes.skeletonRight}
                  />
                ) : (
                  project.engagements.total
                )}
              </Typography>
              <Typography variant="body2" color="primary">
                {!project ? (
                  <>
                    <Skeleton
                      variant="text"
                      width="9ch"
                      className={classes.skeletonRight}
                    />
                    <Skeleton
                      variant="text"
                      width="11ch"
                      className={classes.skeletonRight}
                    />
                  </>
                ) : (
                  <>
                    {project.type === 'Internship' ? 'Internship' : 'Language'}
                    <br />
                    Engagements
                  </>
                )}
              </Typography>
            </div>
            {!project ? (
              <Skeleton variant="text" />
            ) : (
              <DisplaySimpleProperty
                label="ESAD"
                value={
                  project.estimatedSubmission.value ? (
                    <FormattedDate date={project.estimatedSubmission.value} />
                  ) : undefined
                }
                ValueProps={{ color: 'primary' }}
              />
            )}
          </div>
        </CardContent>
      </CardActionAreaLink>
      <TogglePinButton
        object={project}
        label="Project"
        listId="projects"
        listFilter={(args: ProjectListQueryVariables) =>
          args.input.filter?.pinned ?? false
        }
        className={classes.pin}
      />
    </Card>
  );
};
