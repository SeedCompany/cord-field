import { TabContext, TabPanel } from '@mui/lab';
import { Stack } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '~/common';
import {
  EngagementColumns,
  engagementName,
} from '~/components/EngagementDataGrid';
import { ContentContainer } from '~/components/Layout';
import {
  EntityList as EngagementsList,
  EntityList as ProjectsList,
} from '~/components/List';
import { ProjectColumns } from '~/components/ProjectDataGrid';
import { SensitivityIcon } from '~/components/Sensitivity';
import {
  TabLink,
  TabList,
  TabPanelContent,
  TabsContainer,
} from '~/components/Tabs';
import { EngagementListDocument } from './EngagementList.graphql';
import { EngagementsPanel } from './EngagementsPanel';
import { ProjectListDocument } from './ProjectList.graphql';
import { ProjectsPanel } from './ProjectsPanel';

export const ProjectList = () => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();

  return (
    <ContentContainer sx={{ p: { xs: 2, md: 4 }, pt: 2, overflow: 'initial' }}>
      <Helmet title={pathname === '/projects' ? 'Projects' : 'Engagements'} />
      <Stack component="main" sx={{ flex: 1 }}>
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
              {isMobile ? (
                <ProjectsList
                  query={ProjectListDocument}
                  listAt={(data) => data.projects}
                  columns={ProjectColumns}
                  sortDefault={{ field: 'name', direction: 'ASC' }}
                  defaultSecondaryField="primaryLocation.name"
                  primary={(project) => project.name.value}
                  to={(project) => `/projects/${project.id}`}
                  avatar={(project) => (
                    <SensitivityIcon value={project.sensitivity} />
                  )}
                />
              ) : (
                // ai edge-case The grid (and its `useDataGridSource`) only mounts on desktop.
                <TabPanelContent>
                  <ProjectsPanel />
                </TabPanelContent>
              )}
            </TabPanel>
            <TabPanel value="/engagements">
              {isMobile ? (
                <EngagementsList
                  query={EngagementListDocument}
                  listAt={(data) => data.engagements}
                  columns={EngagementColumns}
                  sortDefault={{
                    field: EngagementColumns[0]!.field,
                    direction: 'ASC',
                  }}
                  defaultSecondaryField="project.name"
                  primary={engagementName}
                  to={(engagement) => `/engagements/${engagement.id}`}
                  avatar={(engagement) => (
                    <SensitivityIcon value={engagement.project.sensitivity} />
                  )}
                />
              ) : (
                // ai edge-case The grid (and its `useDataGridSource`) only mounts on desktop.
                <TabPanelContent>
                  <EngagementsPanel />
                </TabPanelContent>
              )}
            </TabPanel>
          </TabContext>
        </TabsContainer>
      </Stack>
    </ContentContainer>
  );
};
