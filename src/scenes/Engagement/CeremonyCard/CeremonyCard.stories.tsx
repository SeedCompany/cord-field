import { boolean, select } from '@storybook/addon-knobs';
import React from 'react';
import { date } from '../../../components/knobs.stories';
import { CeremonyCard as Card } from './CeremonyCard';

export default { title: 'Components' };

export const CeremonyCard = () => (
  <div style={{ width: 600 }}>
    <Card
      canRead
      value={{
        id: '123',
        estimatedDate: {
          canRead: true,
          canEdit: true,
          value: date('Estimated Date'),
        },
        actualDate: {
          canRead: true,
          canEdit: true,
          value: date('Actual Date'),
        },
        type: select(
          'Ceremony Type',
          ['Certification', 'Dedication'],
          'Certification'
        ),
        planned: {
          canRead: true,
          canEdit: true,
          value: boolean('Planned', false),
        },
      }}
    />
  </div>
);
