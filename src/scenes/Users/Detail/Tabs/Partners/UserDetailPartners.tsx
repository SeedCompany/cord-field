import { UserPartnersPanel } from './UserPartnerPanel/UserPartnersPanel';

interface UserDetailPartnersProps {
  canCreate: boolean;
}

// The Paper (TabPanelContent) lives in the panel's desktop grid branch so the
// mobile row list renders bare.
export const UserDetailPartners = ({ canCreate }: UserDetailPartnersProps) => (
  <UserPartnersPanel canCreate={canCreate} />
);
