import {
  Breadcrumbs,
  Chip,
  fade,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add, Publish } from '@material-ui/icons';
import { FC } from 'react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { BudgetOverviewCard } from '../../../components/BudgetOverviewCard';
import { CardGroup } from '../../../components/CardGroup';
import { FilesOverviewCard } from '../../../components/FilesOverviewCard';
import { useDateFormatter } from '../../../components/Formatters';
import { InternshipEngagementListItemCard } from '../../../components/InternshipEngagementListItemCard';
import { LanguageEngagementListItemCard } from '../../../components/LanguageEngagementListItemCard';
import { PartnershipSummary } from '../../../components/PartnershipSummary';
import { ProjectMembersSummary } from '../../../components/ProjectMembersSummary';
import {
  ProjectOverviewQuery,
  useProjectOverviewQuery,
} from './ProjectOverview.generated';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
    '& > *': {
      marginBottom: spacing(3),
    },
  },
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  uploadInput: {
    display: 'none',
  },
  uploadButton: {
    backgroundColor: palette.primary.main,
    color: palette.common.white,
    marginRight: spacing(1),
    '&:hover': {
      backgroundColor: fade(palette.primary.main, 0.5),
    },
  },
  chips: {
    '& > *': {
      marginRight: spacing(2),
    },
  },
  budgetOverviewCard: {
    marginRight: spacing(3),
  },
  addButton: {
    marginLeft: 'auto',
    marginRight: spacing(1),
    backgroundColor: palette.error.main,
    color: palette.common.white,
    '&:hover': {
      backgroundColor: fade(palette.error.main, 0.5),
    },
  },
}));

export const ProjectOverview: FC = () => {
  const classes = useStyles();
  const { projectId } = useParams();
  const dateFormatter = useDateFormatter();

  const { data, error } = useProjectOverviewQuery({
    variables: {
      input: projectId,
    },
  });

  const mouStartDateString =
    data?.project.mouStart.value && dateFormatter(data.project.mouStart.value);
  const mouEndDateString =
    data?.project.mouEnd.value && dateFormatter(data.project.mouEnd.value);

  const engagementSection = (data: ProjectOverviewQuery | undefined) => {
    return (
      <>
        <div className={classes.container}>
          <Typography variant="h3">
            {data?.project?.engagements?.total} &nbsp;
            {data?.project.__typename === 'TranslationProject' &&
              'Language Engagements'}
            {data?.project.__typename === 'InternshipProject' &&
              'Internship Engagements'}
          </Typography>
          <IconButton
            classes={{ root: classes.addButton }}
            aria-label="add button"
          >
            <Add />
          </IconButton>
          <Typography variant="h4">
            Add &nbsp;
            {data?.project.__typename === 'TranslationProject' && 'Language'}
            {data?.project.__typename === 'InternshipProject' && 'Internship'}
          </Typography>
        </div>
        {data?.project?.engagements?.items?.map((engagement) => {
          return engagement.__typename === 'LanguageEngagement' ? (
            <LanguageEngagementListItemCard {...engagement} />
          ) : engagement.__typename === 'InternshipEngagement' ? (
            <InternshipEngagementListItemCard {...engagement} />
          ) : null;
        })}
      </>
    );
  };

  return (
    <div className={classes.root}>
      {error ? (
        <Typography variant="h4">Error fetching Project</Typography>
      ) : (
        <>
          <Breadcrumbs>
            <Breadcrumb to="/projects">Project</Breadcrumb>
            <Breadcrumb to={`/projects/${projectId}`}>
              {data?.project.name?.value}
            </Breadcrumb>
          </Breadcrumbs>
          <Typography variant="h2">{data?.project.name?.value}</Typography>
          <div className={classes.container}>
            <input
              accept="image/*"
              className={classes.uploadInput}
              id="icon-button-file"
              type="file"
            />
            <label htmlFor="icon-button-file">
              <IconButton
                classes={{ root: classes.uploadButton }}
                aria-label="upload picture"
                component="span"
              >
                <Publish />
              </IconButton>
            </label>
            <Typography variant="h4">Upload Files</Typography>
          </div>
          {data && (
            <div className={classes.chips}>
              <Chip
                variant="outlined"
                label={data?.project.location.value?.name}
              />
              <Chip variant="outlined" label={mouStartDateString} />
              <Chip variant="outlined" label={mouEndDateString} />
            </div>
          )}
          <div className={classes.container}>
            <BudgetOverviewCard
              className={classes.budgetOverviewCard}
              budget={data?.project.budget?.value}
            />
            {/* TODO When file api is finished need to update query and pass in file information */}
            <FilesOverviewCard />
          </div>
          <CardGroup>
            <ProjectMembersSummary members={data?.project.team} />
            <PartnershipSummary partnerships={data?.project.partnerships} />
          </CardGroup>
          {engagementSection(data)}
        </>
      )}
    </div>
  );
};
