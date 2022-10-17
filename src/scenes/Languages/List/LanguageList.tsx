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
import { omit, pickBy } from 'lodash';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Language } from '~/api/schema.graphql';
import { simpleSwitch } from '~/common';
import { FilterButtonDialog } from '../../../components/Filter';
import { useNumberFormatter } from '../../../components/Formatters';
import { LanguageListItemCard as LanguageCard } from '../../../components/LanguageListItemCard';
import { ContentContainer } from '../../../components/Layout';
import { List, useListQuery } from '../../../components/List';
import { SortButtonDialog, useSort } from '../../../components/Sort';
import {
  LanguageFilterOptions,
  useLanguageFilters,
} from './LanguageFilterOptions';
import { LanguagesDocument as Languages } from './languages.graphql';
import { LanguageSortOptions } from './LanguageSortOptions';

const TabList = ActualTabList as typeof __Tabs;

const maxWidth = (theme: Theme) => ({
  maxWidth: theme.breakpoints.values.sm,
});

export const LanguageList = () => {
  const sort = useSort<Language>();
  const [filters, setFilters] = useLanguageFilters();
  const list = useListQuery(Languages, {
    listAt: (data) => data.languages,
    variables: {
      input: {
        ...sort.value,
        filter: {
          ...omit(filters, 'tab'),
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
      <Helmet title="Languages" />
      <Typography variant="h2" paragraph>
        Languages
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
            <LanguageSortOptions />
          </SortButtonDialog>
        </Grid>
        <Grid item>
          <FilterButtonDialog
            values={pickBy(omit(filters, 'tab'))}
            onChange={setFilters}
          >
            <LanguageFilterOptions />
          </FilterButtonDialog>
        </Grid>
      </Grid>

      <TabContext value={filters.tab}>
        <TabList
          onChange={(_e, tab) => setFilters({ ...filters, tab })}
          aria-label="language navigation tabs"
          sx={maxWidth}
        >
          <Tab label="Pinned" value="pinned" />
          <Tab label="All" value="all" />
        </TabList>
        <Divider sx={maxWidth} />
        <TabPanel
          value={filters.tab}
          sx={(theme) => ({
            overflowY: 'auto',
            // allow card shadow to bleed over instead of cutting it off
            padding: theme.spacing(0, 0, 0, 2),
            margin: theme.spacing(0, 0, 0, -2),
          })}
          ref={scrollRef}
        >
          <Typography
            variant="h3"
            paragraph
            sx={(theme) => ({
              marginTop: theme.spacing(2),
            })}
          >
            {list.data ? (
              `${formatNumber(list.data.total)} Languages`
            ) : (
              <Skeleton width="14ch" />
            )}
          </Typography>
          <List
            {...list}
            itemMaxWidth={400}
            renderItem={(item) => <LanguageCard language={item} />}
            renderSkeleton={<LanguageCard />}
            scrollRef={scrollRef}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
