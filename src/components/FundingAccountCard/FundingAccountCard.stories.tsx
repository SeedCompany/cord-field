import { number, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import { FundingAccountCard as Card } from './FundingAccountCard';

export default { title: 'Components' };

export const FundingAccountCard = () => (
  <Card
    fundingAccount={{
      id: '1234',
      name: {
        canRead: true,
        canEdit: true,
        value: text('Funding Account Name', 'My Account'),
      },
      createdAt: DateTime.local(),
      accountNumber: {
        canRead: true,
        canEdit: true,
        value: number('Funding Account Number', 12345),
      },
    }}
  />
);
