import { TabPanel } from '@mui/lab';
import { Stack, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { ContentContainer } from '~/components/Layout';
import { ProjectList } from '~/components/ProjectList/ProjectList';
import {
  TabContainer,
  TabList,
  TabPanelContentContainer,
} from '~/components/Tabs';
import { useTable } from '~/hooks';
import { ProjectListDocument } from './ProjectList.graphql';

export const ProjectLayout = () => {
  return (
    <ContentContainer>
      <Helmet title="Projects" />
      <Typography variant="h2" paragraph>
        Projects
      </Typography>

      <Stack
        component="main"
        sx={{
          flex: 1,
          p: 4,
          overflowY: 'auto',
        }}
      >
        <ProjectTabs />
      </Stack>
    </ContentContainer>
  );
};

const ProjectTabs = () => {
  const tabProps = {
    labels: [
      { label: 'Pinned', value: 'pinned' },
      { label: 'Mine', value: 'mine' },
      { label: 'All', value: 'all' },
    ],
    default: 'mine',
  };

  return (
    <TabContainer>
      <TabList tabProps={tabProps}>
        <TabPanel value="pinned">
          <PanelContent preset="pinned" />
        </TabPanel>
        <TabPanel value="mine">
          <PanelContent preset="mine" />
        </TabPanel>
        <TabPanel value="all">
          <PanelContent />
        </TabPanel>
      </TabList>
    </TabContainer>
  );
};

interface PanelContentProps {
  preset?: string;
}

export const PanelContent = ({ preset }: PanelContentProps) => {
  const [props] = useTable({
    query: ProjectListDocument,
    variables: {
      ...(preset && { input: { filter: { [preset]: true } } }),
    },
    listAt: 'projects',
    initialInput: {
      count: 20,
      sort: 'name',
    },
  });

  return (
    <TabPanelContentContainer>
      <ProjectList
        tableProps={props}
        initialState={{
          pinnedColumns: {
            left: ['name'],
          },
        }}
      />
    </TabPanelContentContainer>
  );
};
