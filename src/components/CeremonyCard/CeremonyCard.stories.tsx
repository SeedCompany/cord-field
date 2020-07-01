import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
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
      editCeremony={action('edit clicked')}
    />
  </div>
);
