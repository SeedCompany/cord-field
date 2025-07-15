import { TabPanelContent } from '~/components/Tabs';
import { UserProjectsPanel } from './UserProjectPanel/UserProjectsPanel';

export const UserDetailProjects = () => {
  return (
    <TabPanelContent>
      <UserProjectsPanel />
    </TabPanelContent>
  );
};
