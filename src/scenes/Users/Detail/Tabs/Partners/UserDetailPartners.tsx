import { TabPanelContent } from '~/components/Tabs';
import { UserPartnersPanel } from './UserPartnerPanel/UserPartnersPanel';

export const UserDetailPartners = () => {
  return (
    <TabPanelContent>
      <UserPartnersPanel />
    </TabPanelContent>
  );
};
