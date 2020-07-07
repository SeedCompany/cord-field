import { action } from '@storybook/addon-actions';
import { boolean, select } from '@storybook/addon-knobs';
import React from 'react';
import { dateTime } from '../knobs.stories';
import { CeremonyCard as Card } from './CeremonyCard';

export default { title: 'Components' };

export const CeremonyCard = () => (
  <div style={{ width: 600 }}>
    <Card
      id="123"
      estimatedDate={{ value: dateTime('Estimated Date') }}
      actualDate={{ value: dateTime('Actual Date') }}
      canEdit={boolean('Can Edit', true)}
      type={select(
        'Ceremony Type',
        ['Certification', 'Dedication'],
        'Certification'
      )}
      planned={{
        canEdit: true,
        canRead: true,
        value: boolean('Planned', false),
      }}
      editCeremony={action('edit clicked')}
    />
  </div>
);
