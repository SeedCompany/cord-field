import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';
import { PartnershipFundingTypeList, PartnershipStatuses } from '../../api';
import { csv } from '../../util';
import { dateTime } from '../knobs.stories';
import { PartnershipCard } from './PartnershipCard';
import { PartnershipCardFragment } from './PartnershipCard.generated';

export default { title: 'Components/Partnership Card' };

export const WithData = () => {
  const partnership: PartnershipCardFragment = {
    id: '123',
    organization: {
      name: { value: text('Org name', 'In n Out') },
    },
    createdAt: dateTime('createdAt'),
    types: {
      value: csv(text('Types', 'Managing, Funding')),
    },
    mouStatus: {
      value: select('Mou Status', PartnershipStatuses, 'NotAttached'),
    },
    agreementStatus: {
      value: select('Mou Status', PartnershipStatuses, 'NotAttached'),
    },
    fundingType: {
      value: select('Funding Type', PartnershipFundingTypeList, 'Funded'),
    },
  };

  return <PartnershipCard partnership={partnership} onEdit={action('edit')} />;
};

export const Loading = () => <PartnershipCard onEdit={action('edit')} />;
