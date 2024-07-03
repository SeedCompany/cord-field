import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { ContentContainer } from '~/components/Layout';
import { TabPanelContent, TabsContainer } from '~/components/Tabs';
import { TabLink } from '../../../components/Routing/TabLink';
import { EngagementsPanel } from './EngagementsPanel';
import { ProjectsPanel } from './ProjectsPanel';

export const ProjectList = () => {
  const { pathname } = useLocation();

  return (
    <ContentContainer sx={{ p: 4 }}>
      <Helmet title={pathname === '/projects' ? 'Projects' : 'Engagements'} />
      <Typography variant="h2" paragraph>
        Projects
      </Typography>

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
                <ProjectsPanel />
              </TabPanelContent>
            </TabPanel>
            <TabPanel value="/engagements">
              <TabPanelContent>
                <EngagementsPanel />
              </TabPanelContent>
            </TabPanel>
          </TabContext>
        </TabsContainer>
      </Stack>
    </ContentContainer>
  );
};
