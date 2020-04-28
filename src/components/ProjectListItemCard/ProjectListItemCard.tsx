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
    maxWidth: '700px',
  },
  media: {
    minHeight: '220px',
    width: '220px',
  },
  cardBody: {
    display: 'flex',
  },
  cardContent: {
    display: 'flex',
    flex: '1 1 auto',
    padding: '20px',
  },
  sensitivityLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  leftContent: {
    display: 'flex',
    flexDirection: 'column',
    '& > *:not(:last-child)': {
      marginBottom: '10px',
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
    marginTop: '20px',
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
  // TODO not sure if sensitivity chip color should be changed based on sensitivity
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
            <Typography variant="h3">{name}</Typography>
            <Typography color="primary">
              <Box
                component="span"
                m={2}
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
              <Typography>Sensitivity</Typography>
            </Box>
            <Chip
              className={sensitivityChip}
              size="small"
              label={sensitivity}
              color="secondary"
            />
            <Typography className={statusLabel}>
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
            <Typography color="primary">Languages</Typography>
            <Typography color="primary">Engagements</Typography>
            <Typography color="primary" className={esadDateLabel}>
              <Box component="span" m={2} display="inline" color="text.primary">
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
