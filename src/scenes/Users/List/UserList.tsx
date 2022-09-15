import { TabList as ActualTabList, TabContext, TabPanel } from '@mui/lab';
import {
  type Tabs as __Tabs,
  Divider,
  Grid,
  Skeleton,
  Tab,
  Theme,
  Typography,
} from '@mui/material';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { User } from '~/api/schema.graphql';
import { simpleSwitch } from '~/common';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { UserListItemCardLandscape as UserCard } from '../../../components/UserListItemCard';
import { useUserFilters } from './UserFilterOptions';
import { UsersDocument } from './users.graphql';
import { UserSortOptions } from './UserSortOptions';

const TabList = ActualTabList as typeof __Tabs;

const itemsSx = (theme: Theme) => ({
  maxWidth: theme.breakpoints.values.sm,
});

export const UserList = () => {
  const sort = useSort<User>();
  const [filters, setFilters] = useUserFilters();
  const list = useListQuery(UsersDocument, {
    listAt: (data) => data.users,
    variables: {
      input: {
        ...sort.value,
        filter: {
          ...simpleSwitch(filters.tab, {
            pinned: { pinned: true },
          }),
        },
      },
    },
  });

  const formatNumber = useNumberFormatter();
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <ContentContainer>
      <Helmet title="People" />
      <Typography variant="h2" paragraph>
        People
      </Typography>
      <Grid
        container
        spacing={1}
        sx={(theme) => ({
          margin: theme.spacing(3, 0),
        })}
      >
        <Grid item>
          <SortButtonDialog {...sort}>
            <UserSortOptions />
          </SortButtonDialog>
        </Grid>
      </Grid>

      <TabContext value={filters.tab}>
        <TabList
          onChange={(_e, tab) => setFilters({ ...filters, tab })}
          aria-label="user navigation tabs"
          sx={(theme) => itemsSx(theme)}
        >
          <Tab label="Pinned" value="pinned" />
          <Tab label="All" value="all" />
        </TabList>
        <Divider sx={(theme) => itemsSx(theme)} />
        <TabPanel
          value={filters.tab}
          ref={scrollRef}
          sx={(theme) => ({
            overflowY: 'auto',
            // allow card shadow to bleed over instead of cutting it off
            padding: theme.spacing(0, 0, 0, 2),
            margin: theme.spacing(0, 0, 0, -2),
          })}
        >
          <Typography
            variant="h3"
            sx={(theme) => ({
              marginTop: theme.spacing(2),
            })}
          >
            {list.data ? (
              <>{formatNumber(list.data.total)} People</>
            ) : (
              <Skeleton width="9ch" />
            )}
          </Typography>
          <List
            {...list}
            containerSx={(theme) => itemsSx(theme)}
            renderItem={(item) => <UserCard user={item} />}
            renderSkeleton={<UserCard />}
            scrollRef={scrollRef}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
