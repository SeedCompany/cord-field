import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { VerifiedUserOutlined } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { ProjectStatus, Sensitivity } from '../../api';

const useStyles = makeStyles({
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
    padding: '18px 23px',
  },
  sensitivityLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  leftContent: {
    display: 'flex',
    flexDirection: 'column',
    '& > *:not(:last-child)': {
      marginBottom: '8px',
    },
  },
  rightContent: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  sensitivityIcon: {
    margin: '0 5px',
  },
  sensitivityChip: {
    width: '75px',
  },
  statusLabel: {
    marginTop: 'auto',
  },
  esadDateLabel: {
    marginTop: '24px',
  },
});

export interface ProjectListItemCardProps {
  projectImagePath: string;
  name: string;
  countryName: string;
  region: string;
  sensitivity: Sensitivity;
  status: ProjectStatus;
  numberOfLanguageEngagements: number;
  esadDate: string;
}

export const ProjectListItemCard: FC<ProjectListItemCardProps> = ({
  projectImagePath,
  name,
  countryName,
  region,
  // TODO will wait for sensitivty component so it can be dropped into this one
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
    sensitivityLabel,
    sensitivityChip,
    leftContent,
    rightContent,
    sensitivityIcon,
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
                18397
              </Box>
              {countryName}, {region}
            </Typography>
            <Box className={sensitivityLabel}>
              <VerifiedUserOutlined
                className={sensitivityIcon}
                color="disabled"
              />
              <Typography variant="body2">Sensitivity</Typography>
            </Box>
            <Chip
              className={sensitivityChip}
              size="small"
              label={sensitivity}
              color="secondary"
            />
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
            <Typography variant="body2" color="primary">
              Languages
            </Typography>
            <Typography variant="body2" color="primary">
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
