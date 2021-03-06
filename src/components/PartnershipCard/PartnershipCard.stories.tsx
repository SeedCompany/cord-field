import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';
import { FinancialReportingTypeList, PartnershipStatuses } from '../../api';
import { csv } from '../../util';
import { dateTime } from '../knobs.stories';
import { PartnershipCard } from './PartnershipCard';
import { PartnershipCardFragment } from './PartnershipCard.generated';

export default { title: 'Components/Partnership Card' };

export const WithData = () => {
  const partnership: PartnershipCardFragment = {
    id: '123',
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
            name: {
              canRead: true,
              canEdit: true,
              value: text('Org name', 'In n Out'),
            },
          },
        },
      },
    },
    mouStart: {
      canRead: true,
      canEdit: true,
      value: dateTime('updatedAt'),
    },
    mouEnd: {
      canRead: true,
      canEdit: true,
      value: dateTime('updatedAt'),
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
    financialReportingType: {
      value: select(
        'Financial Reporting Type',
        FinancialReportingTypeList,
        'Funded'
      ),
    },
  };

  return <PartnershipCard partnership={partnership} onEdit={action('edit')} />;
};

export const Loading = () => <PartnershipCard onEdit={action('edit')} />;
