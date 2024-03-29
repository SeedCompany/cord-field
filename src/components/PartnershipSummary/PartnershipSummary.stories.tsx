import { Card } from '@mui/material';
import { boolean } from '@storybook/addon-knobs';
import { PartnershipSummary as PS } from './PartnershipSummary';
import { PartnershipSummaryFragment } from './PartnershipSummary.graphql';
import { PartnershipItemFragment } from './PartnershpItem.graphql';

export default { title: 'Components' };

const generatePartnership = (name: string): PartnershipItemFragment => ({
  id: name,
  partner: {
    canRead: true,
    canEdit: true,
    value: {
      id: '123',
      organization: {
        canEdit: true,
        canRead: true,
        value: {
          id: '456',
          name,
        },
      },
    },
  },
});

export const PartnershipSummary = () => {
  const partnerships: PartnershipSummaryFragment = {
    items: [
      generatePartnership('Seed Company'),
      generatePartnership('Wcyliffe'),
      generatePartnership('DBS'),
    ],
    total: 3,
    hasMore: false,
    nextPage: 0,
  };

  return (
    <Card style={{ maxWidth: 400 }}>
      <PS partnerships={boolean('loading', false) ? undefined : partnerships} />
    </Card>
  );
};
