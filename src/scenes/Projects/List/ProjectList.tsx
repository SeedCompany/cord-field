import { useQuery } from '@apollo/client';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React, { FC } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Project } from '../../../api';
import { FilterButtonDialog } from '../../../components/Filter';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { ListContainer } from '../../../components/Layout/ListContainer';
import { ProjectListItemCard } from '../../../components/ProjectListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
// import { listOrPlaceholders } from '../../../util';
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
  projectItem: {
    marginBottom: spacing(2),
  },
}));

export const ProjectList: FC = () => {
  const classes = useStyles();
  const formatNumber = useNumberFormatter();
  const sort = useSort<Project>();
  const [filters, setFilters] = useProjectFilters();

  const { data } = useQuery(ProjectListDocument, {
    variables: {
      input: {
        ...sort.value,
        filter: filters,
        count: 5,
      },
    },
  });

  const loadMoreItems = async (startIndex: number) => {
    await fetchMore({
      variables: {
        input: {
          ...sort.value,
          filter: filters,
          count: 5,
          page: Math.floor(startIndex / 5 + 1),
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
      <ListContainer>
        {data && (
          <div style={{ height: '55vh' }}>
            <AutoSizer>
              {({ width, height }) => (
                <InfiniteLoader
                  isItemLoaded={(index) => !!data.projects.items[index]}
                  itemCount={data.projects.total}
                  loadMoreItems={loadMoreItems}
                >
                  {({ onItemsRendered, ref }) => (
                    <FixedSizeList
                      height={height}
                      width={width}
                      itemSize={240}
                      itemCount={data.projects.total}
                      itemKey={(index) => {
                        // TypeScript doesn't think the `item` we index below could
                        // ever be undefined, but it is wrong, as demonstrated while
                        // building this logic.
                        /* eslint-disable @typescript-eslint/no-unnecessary-condition */
                        return data.projects.items[index]?.id ?? index;
                      }}
                      onItemsRendered={onItemsRendered}
                      overscanCount={2}
                      ref={ref}
                    >
                      {({ index, style }) => (
                        <div
                          style={style} /*  className={classes.projectItem} */
                        >
                          <ProjectListItemCard
                            project={data.projects.items[index]}
                          />
                        </div>
                      )}
                    </FixedSizeList>
                  )}
                </InfiniteLoader>
              )}
            </AutoSizer>
          </div>
        )}
      </ListContainer>
    </ContentContainer>
  );
};
