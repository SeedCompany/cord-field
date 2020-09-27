import { useQuery } from '@apollo/client';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC, useState } from 'react';
import { Project } from '../../../api';
import { FilterButtonDialog } from '../../../components/Filter';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { ListContainer } from '../../../components/Layout/ListContainer';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import {
  calculateItemsPerPage,
  VirtualList,
} from '../../../components/VirtualList';
import { listOrPlaceholders } from '../../../util';
import {
  ProjectFilterOptions,
  useProjectFilters,
} from './ProjectFilterOptions';
import { ProjectListDocument } from './projects.generated';
import { ProjectSortOptions } from './ProjectSortOptions';

const useStyles = makeStyles(({ spacing }) => ({
  options: {
    margin: spacing(3, 0),
  },
  listContainer: {
    height: '100%',
  },
  projectItem: {
    marginBottom: spacing(2),
  },
}));

export const ProjectList: FC = () => {
  const classes = useStyles();
  const formatNumber = useNumberFormatter();
  const sort = useSort<Project>();
  const [filters, setFilters] = useProjectFilters();
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  const itemsPerPage = containerHeight
    ? calculateItemsPerPage(containerHeight, 240)
    : 5;

  const { data } = useQuery(ProjectListDocument, {
    variables: {
      input: {
        ...sort.value,
        filter: filters,
        count: itemsPerPage,
      },
    },
  });

  const hasMore = data?.projects.hasMore ?? false;
  const currentItemsCount = data?.projects.items.length ?? itemsPerPage;

  const loadMoreItems = async () => {
    await fetchMore({
      variables: {
        input: {
          ...sort.value,
          filter: filters,
          count: 5,
          page: Math.floor(currentItemsCount / itemsPerPage + 1),
        },
      },
    });
  };

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
      <ListContainer className={classes.listContainer}>
        <VirtualList
          dataLength={currentItemsCount}
          next={loadMoreItems}
          hasMore={hasMore}
          itemType="project"
          setContainerHeight={setContainerHeight}
        >
          {listOrPlaceholders(data?.projects.items, itemsPerPage).map(
            (item, index) => (
              <ProjectListItemCard
                key={item?.id ?? index}
                project={item}
                className={classes.projectItem}
              />
            )
          )}
        </VirtualList>
      </ListContainer>
    </ContentContainer>
  );
};
