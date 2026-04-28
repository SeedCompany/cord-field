import { Sidebar as SidebarComponent } from './Sidebar';

export default { title: 'Scenes/Root' };

export const Sidebar = () => <SidebarComponent open />;
export const SidebarCollapsed = () => <SidebarComponent open={false} />;
