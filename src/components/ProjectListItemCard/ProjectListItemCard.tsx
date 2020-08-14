import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { FC } from 'react';
import * as React from 'react';
import { displayStatus } from '../../api';
import { displayLocation } from '../../api/location-helper';
import { DisplaySimpleProperty } from '../DisplaySimpleProperty';
import { useDateFormatter } from '../Formatters';
import { Picture, useRandomPicture } from '../Picture';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';
import { ProjectListItemFragment } from './ProjectListItem.generated';

const useStyles = makeStyles(({ breakpoints, spacing }) => {
  const cardWidth = breakpoints.values.sm;
  return {
    root: {
      width: '100%',
      maxWidth: cardWidth,
    },
    card: {
      display: 'flex',
      alignItems: 'initial',
    },
    media: {
      width: cardWidth / 3,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
    cardContent: {
      flex: 1,
      padding: spacing(2, 3),
      display: 'flex',
      justifyContent: 'space-between',
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
      justifyContent: 'space-between',
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

export const ProjectListItemCard: FC<ProjectListItemCardProps> = ({
  project,
  className,
}) => {
  const classes = useStyles();
  const pic = useRandomPicture({ seed: project?.id, width: 300, height: 200 });
  const location = displayLocation(project?.location.value);
  const formatDate = useDateFormatter();

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink
        disabled={!project}
        to={`/projects/${project?.id}`}
        className={classes.card}
      >
        <div className={classes.media}>
          {!project ? (
            <Skeleton variant="rect" height="100%" />
          ) : (
            <Picture fit="cover" {...pic} style={{ paddingBottom: 0 }} />
          )}
        </div>
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
              value={project?.deptId.value}
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
                  value={displayStatus(project.status)}
                />
              )}
            </Grid>
          </Grid>
          <div className={classes.rightContent}>
            <DisplaySimpleProperty aria-hidden="true" />

            <div>
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
                  project.estimatedSubmission.value
                    ? formatDate(project.estimatedSubmission.value)
                    : undefined
                }
                ValueProps={{ color: 'primary' }}
              />
            )}
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};
