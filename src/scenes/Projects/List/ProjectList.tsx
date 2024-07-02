import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Grid, Stack, ToggleButton, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { ContentContainer } from '~/components/Layout';
import { TabPanelContent, TabsContainer } from '~/components/Tabs';
import { BooleanParam, makeQueryHandler, withDefault } from '~/hooks';
import { TabLink } from '../../../components/Routing/TabLink';
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
});

export const ProjectList = () => {
  const { pathname } = useLocation();
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
          <TabContext value={pathname}>
            <TabList>
              <TabLink to="/projects" value="/projects" label="Projects" />
              <TabLink
                to="/engagements"
                value="/engagements"
                label="Engagements"
              />
            </TabList>
            <TabPanel value="/projects">
              <TabPanelContent>
                <ProjectsPanel filters={filters} />
              </TabPanelContent>
            </TabPanel>
            <TabPanel value="/engagements">
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
