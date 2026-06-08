import { EngagementPanel } from './Panels/EngagementPanel';
import { ProjectPanel } from './Panels/ProjectPanel';

const panels = {
  Engagement: EngagementPanel,
  Project: ProjectPanel,
} satisfies Record<string, React.ComponentType<{ toolId: string }>>;

export type UsageTab = keyof typeof panels;

interface ToolDetailUsagesProps {
  toolId: string;
  tab: UsageTab;
}

export const ToolDetailUsages = ({ toolId, tab }: ToolDetailUsagesProps) => {
  const Panel = panels[tab];
  return <Panel toolId={toolId} />;
};
