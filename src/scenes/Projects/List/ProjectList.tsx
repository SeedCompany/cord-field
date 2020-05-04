import { Grid, makeStyles, Typography } from '@material-ui/core';
import React, { FC } from 'react';
import { Project } from '../../../api';
import { FilterButtonDialog } from '../../../components/Filter';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { ProjectListItemFragment } from '../../../components/ProjectListItemCard/ProjectListItem.generated';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { VirtualList } from '../../../components/VirtualList';
import { listOrPlaceholders } from '../../../util';
import {
  ProjectFilterOptions,
  useProjectFilters,
} from './ProjectFilterOptions';
import { useProjectListQuery } from './ProjectList.generated';
import { ProjectSortOptions } from './ProjectSortOptions';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    flex: 1,
    overflowY: 'scroll',
    padding: spacing(4),
  },
  options: {
    margin: spacing(3, 0),
  },
  projectItem: {
    marginBottom: spacing(2),
  },
}));

export const ProjectList: FC = () => {
  const sort = useSort<Project>();
  const [filters, setFilters] = useProjectFilters();
  const input = {
    ...sort.value,
    filter: filters,
  };

  const { data, fetchMore } = useProjectListQuery({
    variables: {
      input,
    },
  });
  const classes = useStyles();

  return (
    <div className={classes.root}>
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
        {data?.projects.total} Projects
      </Typography>
      <VirtualList<ProjectListItemFragment | undefined>
        ItemComponent={({ item, style, index }) => (
          <div
            key={item?.id ?? index}
            style={{
              ...style,
            }}
            className={classes.projectItem}
          >
            <ProjectListItemCard key={item?.id ?? index} project={item} />
          </div>
        )}
        itemHeight={224}
        total={data?.projects.total || 5}
        list={
          listOrPlaceholders(data?.projects.items, 5) as Array<
            ProjectListItemFragment | undefined
          >
        }
        isRowLoaded={({ index }) => !!data?.projects.items[index]}
        loadMoreRows={async ({ startIndex, stopIndex }) => {
          console.log('ProjectList::loadMoreRows', startIndex, stopIndex);
          if (data?.projects.items.length) {
            await fetchMore({
              variables: {
                input: {
                  ...input,
                  offset: data?.projects.items.length,
                },
              },
            });
          }
        }}
      />
    </div>
  );
};
