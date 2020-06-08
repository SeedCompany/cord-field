import { Card } from '@material-ui/core';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import { PartnershipSummary as PS } from './PartnershipSummary';
import { PartnershipSummaryFragment } from './PartnershipSummary.generated';
import { PartnershipItemFragment } from './PartnershpItem.generated';

export default { title: 'Components' };

const generatePartnership = (name: string): PartnershipItemFragment => ({
  id: name,
  organization: {
    id: 'abc123',
    name: {
      value: name,
    },
    avatarLetters: name[0],
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
  };

  return (
    <Card style={{ maxWidth: 400 }}>
      <PS partnerships={boolean('loading', false) ? undefined : partnerships} />
    </Card>
  );
};
