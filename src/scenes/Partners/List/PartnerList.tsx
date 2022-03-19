import {
  type Tabs as __Tabs,
  Divider,
  Grid,
  makeStyles,
  Tab,
  Typography,
} from '@material-ui/core';
import {
  TabList as ActualTabList,
  Skeleton,
  TabContext,
  TabPanel,
} from '@material-ui/lab';
import React, { FC, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { PartnerListItemCard as PartnerCard } from '../../../components/PartnerListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { simpleSwitch } from '../../../util';
import { usePartnerFilters } from './PartnerFilterOptions';
import { PartnersDocument } from './PartnerList.generated';
import { PartnerSort, PartnerSortOptions } from './PartnerSortOptions';

const TabList = ActualTabList as typeof __Tabs;

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
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

export const PartnerList: FC = () => {
  const sort = useSort<PartnerSort>('name');
  const [filters, setFilters] = usePartnerFilters();
  const list = useListQuery(PartnersDocument, {
    listAt: (data) => data.partners,
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

  const classes = useStyles();
  const formatNumber = useNumberFormatter();
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <ContentContainer>
      <Helmet title="Partners" />
      <Typography variant="h2" paragraph>
        Partners
      </Typography>
      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <SortButtonDialog {...sort}>
            <PartnerSortOptions />
          </SortButtonDialog>
        </Grid>
      </Grid>

      <TabContext value={filters.tab}>
        <TabList
          onChange={(_e, tab) => setFilters({ ...filters, tab })}
          aria-label="partner navigation tabs"
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
              `${formatNumber(list.data.total)} Partners`
            ) : (
              <Skeleton width="10ch" />
            )}
          </Typography>
          <List
            {...list}
            classes={{ container: classes.items }}
            renderItem={(item) => <PartnerCard partner={item} />}
            renderSkeleton={<PartnerCard />}
            scrollRef={scrollRef}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
