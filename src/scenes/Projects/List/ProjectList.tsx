import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Grid, Stack, Tab, ToggleButton, Typography } from '@mui/material';
import {
  DataGridPro as DataGrid,
  DataGridProProps as DataGridProps,
} from '@mui/x-data-grid-pro';
import { merge } from 'lodash';
import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
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
  withDefault,
} from '~/hooks';
import { ProjectListDocument } from './ProjectList.graphql';

const useStyles = makeStyles()(({ spacing }) => ({
  options: {
    margin: spacing(1, 0),
  },
}));

const useProjectListFilters = makeQueryHandler({
  pinned: withDefault(BooleanParam(), false),
  mine: withDefault(BooleanParam(), true),
  tab: withDefault(EnumParam(['projects']), 'projects'),
});

export const ProjectLayout = () => {
  const { classes } = useStyles();
  const [filters, setFilters] = useProjectListFilters();

  const [props] = useDataGridSource({
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
    () => merge({}, DefaultDataGridStyles.slotProps, props.slotProps),
    [props.slotProps]
  );

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
              onChange={(_e, val) => {
                console.log(val);
                setFilters({ ...filters, mine: !filters.mine });
              }}
            >
              Mine
            </ToggleButton>
            <ToggleButton
              selected={filters.pinned}
              value="pinned"
              aria-label="pinned"
              onChange={(_e, val) => {
                console.log(val);
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
              onChange={(_e, tab) => setFilters({ ...filters, tab })}
              aria-label="navigation tabs"
              variant="scrollable"
            >
              <Tab label="Projects" value="projects" />
            </TabList>
            <TabPanel value="projects">
              <TabPanelContent>
                <DataGrid<Project>
                  {...DefaultDataGridStyles}
                  {...props}
                  slotProps={slotProps}
                  columns={ProjectColumns}
                  initialState={initialState}
                  headerFilters
                  sx={[flexLayout, noHeaderFilterButtons]}
                />
              </TabPanelContent>
            </TabPanel>
          </TabContext>
        </TabsContainer>
      </Stack>
    </ContentContainer>
  );
};

const initialState = {
  pinnedColumns: {
    left: [ProjectColumns[0]!.field],
  },
} satisfies DataGridProps['initialState'];
