import { TabList as ActualTabList, TabContext, TabPanel } from '@mui/lab';
import {
  type Tabs as __Tabs,
  Divider,
  Grid,
  Skeleton,
  Tab,
  Typography,
} from '@mui/material';
import { omit, pickBy } from 'lodash';
import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { Language } from '~/api/schema.graphql';
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

const useStyles = makeStyles()(({ spacing, breakpoints }) => ({
  options: {
    margin: spacing(3, 0),
  },
  maxWidth: {
    maxWidth: breakpoints.values.sm,
  },
  tabPanel: {
    overflowY: 'auto',
    // allow card shadow to bleed over instead of cutting it off
    padding: spacing(0, 0, 0, 2),
    margin: spacing(0, 0, 0, -2),
  },
  items: {
    maxWidth: 400,
  },
  total: {
    marginTop: spacing(2),
  },
}));

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
          ...(filters.tab === 'pinned' ? { pinned: true } : {}),
        },
      },
    },
  });

  const { classes } = useStyles();
  const formatNumber = useNumberFormatter();
  const scrollRef = useRef<HTMLElement>(null);

  return (
    <ContentContainer>
      <Helmet title="Languages" />
      <Typography variant="h2" paragraph>
        Languages
      </Typography>
      <Grid container spacing={1} className={classes.options}>
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
          className={classes.maxWidth}
        >
          <Tab label="Pinned" value="pinned" />
          <Tab label="All" value="all" />
        </TabList>
        <Divider className={classes.maxWidth} />
        <TabPanel
          value={filters.tab}
          className={classes.tabPanel}
          ref={scrollRef}
        >
          <Typography variant="h3" paragraph className={classes.total}>
            {list.data ? (
              `${formatNumber(list.data.total)} Languages`
            ) : (
              <Skeleton width="14ch" />
            )}
          </Typography>
          <List
            {...list}
            classes={{ container: classes.items }}
            renderItem={(item) => <LanguageCard language={item} />}
            renderSkeleton={<LanguageCard />}
            scrollRef={scrollRef}
          />
        </TabPanel>
      </TabContext>
    </ContentContainer>
  );
};
