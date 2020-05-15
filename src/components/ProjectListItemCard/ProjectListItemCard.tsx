import {
  Card,
  CardContent,
  Grid,
  makeStyles,
  Typography,
  TypographyProps,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import clsx from 'clsx';
import { random } from 'lodash';
import { FC, useState } from 'react';
import * as React from 'react';
import { ProjectListItemFragment } from '../../api';
import { displayStatus } from '../../api/displayStatus';
import { displayLocation } from '../../api/location-helper';
import { Picture } from '../Picture';
import { CardActionAreaLink } from '../Routing';
import { Sensitivity } from '../Sensitivity';

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
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    rightContent: {
      marginLeft: spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    sensitivity: {
      marginBottom: spacing(1),
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
  const genSrc = () => `https://picsum.photos/id/${random(1, 2000)}/300/200`;
  const [pic, setPic] = useState(genSrc);
  const nextPic = () => setPic(genSrc());

  return (
    <Card className={clsx(classes.root, className)}>
      <CardActionAreaLink
        to={`/projects/${project?.id}`}
        className={classes.card}
      >
        <div className={classes.media}>
          {!project ? (
            <Skeleton variant="rect" height={200} />
          ) : (
            <Picture
              source={pic}
              fit="cover"
              width={300}
              height={200}
              onError={nextPic}
            />
          )}
        </div>
        <CardContent className={classes.cardContent}>
          <Grid
            container
            direction="column"
            justify="space-between"
            spacing={1}
          >
            <Grid item>
              {!project ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="h4">{project.name?.value}</Typography>
              )}
            </Grid>
            <Grid item>
              {!project ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  {project.deptId.value ?? project.id}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {!project ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" color="primary">
                  {displayLocation(project.location.value)}
                </Typography>
              )}
            </Grid>
            <Grid item>
              {!project ? (
                <Skeleton variant="text" />
              ) : (
                <Sensitivity
                  value={project.sensitivity}
                  className={classes.sensitivity}
                />
              )}
            </Grid>
            <Grid item>
              {!project ? (
                <Skeleton variant="text" />
              ) : (
                <KeyValProp
                  label="Status"
                  value={displayStatus(project.status)}
                />
              )}
            </Grid>
          </Grid>
          <div className={classes.rightContent}>
            <KeyValProp aria-hidden="true" />

            <div>
              {!project ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="h1" align="right">
                  {0}
                </Typography>
              )}
              {!project ? (
                <Skeleton variant="text" />
              ) : (
                <Typography variant="body2" color="primary" align="right">
                  {project.type === 'Internship' ? 'Internship' : 'Language'}
                  <br />
                  Engagements
                </Typography>
              )}
            </div>
            {!project ? (
              <Skeleton variant="text" />
            ) : (
              <KeyValProp
                label="ESAD"
                value={project.estimatedSubmission?.value}
                ValueProps={{ color: 'primary' }}
              />
            )}
          </div>
        </CardContent>
      </CardActionAreaLink>
    </Card>
  );
};

const KeyValProp = ({
  label,
  LabelProps,
  value,
  ValueProps,
  ...props
}: {
  label?: string;
  LabelProps?: TypographyProps;
  value?: string | null;
  ValueProps?: TypographyProps;
} & TypographyProps) => (
  <Typography variant="body2" {...props}>
    {label && value ? (
      <Typography variant="inherit" {...LabelProps}>
        {label}:&nbsp;
      </Typography>
    ) : null}
    <Typography variant="inherit" color="textSecondary" {...ValueProps}>
      {value}
    </Typography>
  </Typography>
);
