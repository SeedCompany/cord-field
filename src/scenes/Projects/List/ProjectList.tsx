import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import { Project } from '../../../api';
import { ContentContainer } from '../../../components/ContentContainer';
import { FilterButtonDialog } from '../../../components/Filter';
import { useNumberFormatter } from '../../../components/Formatters';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { listOrPlaceholders } from '../../../util';
import {
  ProjectFilterOptions,
  useProjectFilters,
} from './ProjectFilterOptions';
import { useProjectListQuery } from './projects.generated';
import { ProjectSortOptions } from './ProjectSortOptions';

const useStyles = makeStyles(({ spacing }) => ({
  options: {
    margin: spacing(3, 0),
  },
  projectItem: {
    marginBottom: spacing(2),
  },
  listContainer: {
    marginLeft: spacing(-2),
    overflow: 'auto',
    padding: spacing(2),
  },
}));

export const ProjectList: FC = () => {
  const formatNumber = useNumberFormatter();
  const sort = useSort<Project>();
  const [filters, setFilters] = useProjectFilters();

  const { data } = useProjectListQuery({
    variables: {
      input: {
        ...sort.value,
        filter: filters,
      },
    },
  });
  const classes = useStyles();

  return (
    <ContentContainer>
      <Typography variant="h2" paragraph>
        My Projects
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <ProjectSortOptions />
          </SortButtonDialog>
        </Grid>
        <Grid item>
          <FilterButtonDialog values={filters} onChange={setFilters}>
            <ProjectFilterOptions />
          </FilterButtonDialog>
        </Grid>
      </Grid>
      <Typography variant="h3" paragraph>
        {data ? (
          `${formatNumber(data.projects.total)} Projects`
        ) : (
          <Skeleton width="12ch" />
        )}
      </Typography>
      <div className={classes.listContainer}>
        {listOrPlaceholders(data?.projects.items, 5).map((item, index) => (
          <ProjectListItemCard
            key={item?.id ?? index}
            project={item}
            className={classes.projectItem}
          />
        ))}
      </div>
    </ContentContainer>
  );
};
