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
import { ProjectStatus, Sensitivity as SensitivityType } from '../../api';
import { Sensitivity } from '../Sensitivity';

const useStyles = makeStyles(({ spacing }) => ({
  card: {
    maxWidth: '573px',
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
    marginTop: spacing(3),
  },
}));

export interface ProjectListItemCardProps {
  id: string;
  projectImagePath: string;
  name: string;
  countryName: string;
  region: string;
  sensitivity: SensitivityType;
  status: ProjectStatus;
  numberOfLanguageEngagements: number;
  esadDate: string;
}

export const ProjectListItemCard: FC<ProjectListItemCardProps> = ({
  id,
  projectImagePath,
  name,
  countryName,
  region,
  sensitivity,
  status,
  numberOfLanguageEngagements,
  esadDate,
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
          image={projectImagePath}
          title="Project Image"
        />
        <CardContent className={cardContent}>
          <div className={leftContent}>
            <Typography variant="h4">{name}</Typography>
            <Typography color="primary" variant="body2">
              <Box
                component="span"
                m={1}
                display="inline"
                color="text.secondary"
              >
                {id}
              </Box>
              {countryName}, {region}
            </Typography>
            <Sensitivity value={sensitivity} />
            <Typography className={statusLabel} variant="body2">
              Status:
              <Box
                component="span"
                m={1}
                display="inline"
                color="text.secondary"
              >
                {status}
              </Box>
            </Typography>
          </div>
          <div className={rightContent}>
            <Typography variant="h1">{numberOfLanguageEngagements}</Typography>
            <Typography variant="body2" color="primary" align="right">
              Languages
              <br />
              Engagements
            </Typography>
            <Typography
              variant="body2"
              color="primary"
              className={esadDateLabel}
            >
              <Box component="span" m={1} display="inline" color="text.primary">
                ESAD:
              </Box>
              {esadDate}
            </Typography>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
