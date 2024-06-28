import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Grid, Stack, Tab, ToggleButton, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { makeStyles } from 'tss-react/mui';
import { ContentContainer } from '~/components/Layout';
import { TabPanelContent, TabsContainer } from '~/components/Tabs';
import {
  BooleanParam,
  EnumParam,
  makeQueryHandler,
  withDefault,
} from '~/hooks';
import { EngagementsPanel } from './EngagementsPanel';
import { ProjectsPanel } from './ProjectsPanel';

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

export const ProjectList = () => {
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
