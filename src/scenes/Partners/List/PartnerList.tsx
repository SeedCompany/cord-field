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
import { simpleSwitch } from '~/common';
import { useNumberFormatter } from '../../../components/Formatters';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { PartnerListItemCard as PartnerCard } from '../../../components/PartnerListItemCard';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import { usePartnerFilters } from './PartnerFilterOptions';
import { PartnersDocument } from './PartnerList.graphql';
import { PartnerSort, PartnerSortOptions } from './PartnerSortOptions';

const TabList = ActualTabList as typeof __Tabs;

export const PartnerList = () => {
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
  const formatNumber = useNumberFormatter();
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <ContentContainer>
      <Helmet title="Partners" />
      <Typography variant="h2" paragraph>
        Partners
      </Typography>
      <Grid container spacing={1} sx={{ my: 3, mx: 0 }}>
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
          sx={{ maxWidth: 'sm' }}
        >
          <Tab label="Pinned" value="pinned" />
          <Tab label="All" value="all" />
        </TabList>
        <Divider sx={{ maxWidth: 'sm' }} />
        <TabPanel
          value={filters.tab}
          sx={{
            overflowY: 'auto',
            // allow card shadow to bleed over instead of cutting it off
            py: 0,
            pl: 2,
            ml: -2,
          }}
          ref={scrollRef}
        >
          <Typography variant="h3" sx={{ mt: 2 }}>
            {list.data ? (
              `${formatNumber(list.data.total)} Partners`
            ) : (
              <Skeleton width="10ch" />
            )}
          </Typography>
          <List
            {...list}
            itemMaxWidth="sm"
            renderItem={(item) => <PartnerCard partner={item} />}
            renderSkeleton={<PartnerCard />}
            scrollRef={scrollRef}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
