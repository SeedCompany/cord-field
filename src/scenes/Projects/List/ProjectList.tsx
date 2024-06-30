import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Grid, Stack, Tab, ToggleButton, Typography } from '@mui/material';
import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { DecodedValueMap } from 'serialize-query-params';
import { makeStyles } from 'tss-react/mui';
import {
  EngagementDataGridRowFragment as Engagement,
  EngagementColumns,
} from '~/components/EngagementDataGrid';
import {
  DefaultDataGridStyles,
  flexLayout,
  noHeaderFilterButtons,
  useDataGridSource,
} from '~/components/Grid';
import { ContentContainer } from '~/components/Layout';
import {
  ProjectDataGridRowFragment as Project,
  ProjectColumns,
} from '~/components/ProjectDataGrid';
import { TabPanelContent, TabsContainer } from '~/components/Tabs';
import {
  BooleanParam,
  EnumParam,
  makeQueryHandler,
  QueryParamConfig,
  withDefault,
} from '~/hooks';
import { EngagementListDocument } from './EngagementList.graphql';
import { ProjectListDocument } from './ProjectList.graphql';

const useStyles = makeStyles()(({ spacing }) => ({
  options: {
    margin: spacing(1, 0),
  },
}));

const useProjectListFilters = makeQueryHandler({
  pinned: withDefault(BooleanParam(), false),
  mine: withDefault(BooleanParam(), true),
  tab: withDefault(EnumParam(['projects', 'engagements']), 'projects'),
});

export const ProjectLayout = () => {
  const { classes } = useStyles();
  const [filters, setFilters] = useProjectListFilters();

  return (
    <ContentContainer>
      <Helmet title="Projects" />
      <Typography variant="h2" paragraph>
        Projects
      </Typography>

      <Grid container spacing={1} className={classes.options}>
        <Grid item>
          <form>
            <ToggleButton
              selected={filters.mine}
              value="mine"
              aria-label="mine"
              onChange={() => {
                setFilters({ ...filters, mine: !filters.mine });
              }}
            >
              Mine
            </ToggleButton>
            <ToggleButton
              selected={filters.pinned}
              value="pinned"
              aria-label="pinned"
              onChange={() => {
                setFilters({ ...filters, pinned: !filters.pinned });
              }}
            >
              Pinned
            </ToggleButton>
          </form>
        </Grid>
      </Grid>

      <Stack
        component="main"
        sx={{
          flex: 1,
          p: 1,
          overflowY: 'auto',
        }}
      >
        <TabsContainer>
          <TabContext value={filters.tab}>
            <TabList
              onChange={(_e, tab) => {
                setFilters({ ...filters, tab });
              }}
              aria-label="navigation tabs"
              variant="scrollable"
            >
              <Tab label="Projects" value="projects" />
              <Tab label="Engagements" value="engagements" />
            </TabList>
            <TabPanel value="projects">
              <TabPanelContent>
                <ProjectsPanel filters={filters} />
              </TabPanelContent>
            </TabPanel>
            <TabPanel value="engagements">
              <TabPanelContent>
                <EngagementsPanel filters={filters} />
              </TabPanelContent>
            </TabPanel>
          </TabContext>
        </TabsContainer>
      </Stack>
    </ContentContainer>
  );
};

interface PanelProps {
  filters: DecodedValueMap<{
    pinned: QueryParamConfig<boolean, boolean>;
    mine: QueryParamConfig<boolean, boolean>;
    tab: QueryParamConfig<
      NonNullable<'projects' | 'engagements'>,
      NonNullable<'projects' | 'engagements'>
    >;
  }>;
}

const ProjectsPanel = ({ filters }: PanelProps) => {
  const [dataGridProps] = useDataGridSource({
    query: ProjectListDocument,
    variables: {
      input: {
        filter: {
          ...(filters.mine ? { mine: true } : {}),
          ...(filters.pinned ? { pinned: true } : {}),
        },
      },
    },
    listAt: 'projects',
    initialInput: {},
  });

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

  return (
    <DataGrid<Project>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slotProps={slotProps}
      columns={ProjectColumns}
      initialState={projectInitialState}
      headerFilters
      sx={[flexLayout, noHeaderFilterButtons]}
    />
  );
};

const EngagementsPanel = ({ filters }: PanelProps) => {
  const [dataGridProps] = useDataGridSource({
    query: EngagementListDocument,
    variables: {
      input: {
        filter: {
          ...(filters.mine ? { mine: true } : {}),
          ...(filters.pinned ? { pinned: true } : {}),
        },
      },
    },
    listAt: 'engagements',
    initialInput: {},
  });

  const slotProps = useMemo(
    () => merge({}, DefaultDataGridStyles.slotProps, dataGridProps.slotProps),
    [dataGridProps.slotProps]
  );

  return (
    <DataGrid<Engagement>
      {...DefaultDataGridStyles}
      {...dataGridProps}
      slotProps={slotProps}
      columns={EngagementColumns}
      initialState={engagementInitialState}
      headerFilters
      sx={[flexLayout, noHeaderFilterButtons]}
    />
  );
};

const projectInitialState = {
  pinnedColumns: {
    left: [ProjectColumns[0]!.field],
  },
} satisfies DataGridProps['initialState'];

const engagementInitialState = {
  pinnedColumns: {
    left: [EngagementColumns[0]!.field],
  },
} satisfies DataGridProps['initialState'];
