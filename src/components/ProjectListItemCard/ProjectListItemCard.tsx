import {
  Box,
  Card,
  CardContent,
  CardMedia,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { FC } from 'react';
import * as React from 'react';
import { ProjectListItemFragment } from '../../api';
import { displayLocation } from '../../api/location-helper';
import { Sensitivity } from '../Sensitivity';

const useStyles = makeStyles(({ spacing }) => ({
  card: {
    maxWidth: '573px',
    marginTop: spacing(1),
  },
  media: {
    minHeight: '169px',
    width: '176px',
  },
  cardBody: {
    display: 'flex',
  },
  cardContent: {
    display: 'flex',
    flex: '1 1 auto',
    padding: spacing(2, 3),
  },
  sensitivityLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  leftContent: {
    display: 'flex',
    flexDirection: 'column',
    '& > *:not(:last-child)': {
      marginBottom: spacing(1),
    },
  },
  rightContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  statusLabel: {
    marginTop: 'auto',
  },
  esadDateLabel: {
    marginTop: spacing(2),
    '& span': {
      color: '#3c444e',
    },
  },
}));

export type ProjectListItemCardProps = ProjectListItemFragment;

export const ProjectListItemCard: FC<ProjectListItemCardProps> = ({
  ...props
}) => {
  const {
    media,
    card,
    cardBody,
    cardContent,
    leftContent,
    rightContent,
    statusLabel,
    esadDateLabel,
  } = useStyles();

  return (
    <Card className={card}>
      <div className={cardBody}>
        <CardMedia
          className={media}
          image="/images/favicon-32x32.png" //Should be updated in next version.
          title="Project Image"
        />
        <CardContent className={cardContent}>
          <div className={leftContent}>
            <Typography variant="h4">{props.name?.value}</Typography>
            <Typography color="primary" variant="body2">
              <Box
                component="span"
                m={1}
                display="inline"
                color="text.secondary"
              >
                {props.id}
              </Box>
              {displayLocation(props.location.value)}
            </Typography>
            <Sensitivity value={props.sensitivity} />
            <Typography className={statusLabel} variant="body2">
              Status:
              <Box
                component="span"
                m={1}
                display="inline"
                color="text.secondary"
              >
                {props.status}
              </Box>
            </Typography>
          </div>
          <div className={rightContent}>
            <Typography variant="h1">{0}</Typography>
            <Typography variant="body2" color="primary" align="right">
              {props.type === 'Internship' ? 'Internship' : 'Language'}
              <br />
              Engagements
            </Typography>
            {props.estimatedSubmission?.value ? (
              <Typography
                variant="body2"
                color="primary"
                className={esadDateLabel}
              >
                <span>ESAD:</span>
                {props.estimatedSubmission?.value}
              </Typography>
            ) : (
              ''
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
