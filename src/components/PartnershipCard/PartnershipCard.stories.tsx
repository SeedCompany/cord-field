import { object, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { date } from '../knobs.stories';
import { PartnershipCard } from './PartnershipCard';
import { PartnershipCardFragment } from './PartnershipCard.generated';

export default { title: 'Components/Project Partnership List Item Card' };

export const WithData = () => {
  const partnership: PartnershipCardFragment = {
    id: '123',
    organization: {
      name: { value: text('Org name', 'In n Out') },
    },
    createdAt: date('createdAt'),
    types: {
      value: object('Types', ['Managing']),
    },
    mouStatus: {
      value: select(
        'Mou Status',
        ['NotAttached', 'AwaitingSignature', 'Signed'],
        'NotAttached'
      ),
    },
    agreementStatus: {
      value: select(
        'Mou Status',
        ['NotAttached', 'AwaitingSignature', 'Signed'],
        'NotAttached'
      ),
    },
  };

  return <PartnershipCard partnership={partnership} />;
};

export const Loading = () => <PartnershipCard />;
