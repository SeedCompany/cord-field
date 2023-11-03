import { TabList as ActualTabList, TabContext, TabPanel } from '@mui/lab';
import {
  type Tabs as __Tabs,
  Divider,
  Grid,
  Skeleton,
  Tab,
  Typography,
} from '@mui/material';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { User } from '~/api/schema.graphql';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { UserListItemCardLandscape as UserCard } from '../../../components/UserListItemCard';
import { useUserFilters } from './UserFilterOptions';
import { UsersDocument } from './users.graphql';
import { UserSortOptions } from './UserSortOptions';

const TabList = ActualTabList as typeof __Tabs;

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  options: {
    margin: spacing(3, 0),
  },
  items: {
    maxWidth: breakpoints.values.sm,
  },
  tabPanel: {
    overflowY: 'auto',
    // allow card shadow to bleed over instead of cutting it off
    padding: spacing(0, 0, 0, 2),
    margin: spacing(0, 0, 0, -2),
  },
  total: {
    marginTop: spacing(2),
  },
}));

export const UserList = () => {
  const sort = useSort<User>();
  const [filters, setFilters] = useUserFilters();
  const list = useListQuery(UsersDocument, {
    listAt: (data) => data.users,
    variables: {
      input: {
        ...sort.value,
        filter: filters.tab === 'pinned' ? { pinned: true } : {},
      },
    },
  });

  const { classes } = useStyles();
  const formatNumber = useNumberFormatter();
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <ContentContainer>
      <Helmet title="People" />
      <Typography variant="h2" paragraph>
        People
      </Typography>
      <Grid container spacing={1} className={classes.options}>
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
          className={classes.items}
        >
          <Tab label="Pinned" value="pinned" />
          <Tab label="All" value="all" />
        </TabList>
        <Divider className={classes.items} />
        <TabPanel
          value={filters.tab}
          className={classes.tabPanel}
          ref={scrollRef}
        >
          <Typography variant="h3" className={classes.total}>
            {list.data ? (
              <>{formatNumber(list.data.total)} People</>
            ) : (
              <Skeleton width="9ch" />
            )}
          </Typography>
          <List
            {...list}
            classes={{ container: classes.items }}
            renderItem={(item) => <UserCard user={item} />}
            renderSkeleton={<UserCard />}
            scrollRef={scrollRef}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
