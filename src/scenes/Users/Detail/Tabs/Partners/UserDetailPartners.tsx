import { TabPanelContent } from '~/components/Tabs';
import { UserPartnersPanel } from './UserPartnerPanel/UserPartnersPanel';

interface UserDetailPartnersProps {
  canCreate: boolean;
}

export const UserDetailPartners = ({ canCreate }: UserDetailPartnersProps) => {
  return (
    <TabPanelContent>
      <UserPartnersPanel canCreate={canCreate} />
    </TabPanelContent>
  );
};
