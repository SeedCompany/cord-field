import { csv } from '@seedcompany/common';
import { action } from '@storybook/addon-actions';
import { select, text } from '@storybook/addon-knobs';
import { FinancialReportingTypeList, PartnershipAgreementStatusList } from '~/api/schema.graphql';
import { date, dateTime } from '../knobs.stories';
import { PartnershipCard } from './PartnershipCard';
import { PartnershipCardFragment } from './PartnershipCard.graphql';

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
    mouRange: {
      canRead: true,
      canEdit: true,
      value: {
        start: date('start'),
        end: date('end'),
      },
    },
    createdAt: dateTime('createdAt'),
    types: {
      value: csv(text('Types', 'Managing, Funding')),
    },
    mouStatus: {
      value: select('Mou Status', PartnershipAgreementStatusList, 'NotAttached'),
    },
    agreementStatus: {
      value: select('Mou Status', PartnershipAgreementStatusList, 'NotAttached'),
    },
    financialReportingType: {
      value: select(
        'Financial Reporting Type',
        FinancialReportingTypeList,
        'Funded'
      ),
    },
    primary: {
      canRead: true,
      canEdit: true,
      value: true,
    },
  };

  return <PartnershipCard partnership={partnership} onEdit={action('edit')} />;
};

export const Loading = () => <PartnershipCard onEdit={action('edit')} />;
