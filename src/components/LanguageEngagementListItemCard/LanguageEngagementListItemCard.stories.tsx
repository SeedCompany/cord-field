import { number, text } from '@storybook/addon-knobs';
import React from 'react';
import { EngagementStatus } from '../../api';
import { date } from '../knobs.stories';
import { LanguageEngagementListItemCard as Card } from './LanguageEngagementListItemCard';

export default { title: 'Components' };

export const LanguageEngagementListItemCard = () => (
  <Card
    id="123123"
    status={text('status', 'InDevelopment') as EngagementStatus}
    endDate={{ value: date('endDate') }}
    initialEndDate={{
      value: date('initialEndDate'),
    }}
    completeDate={{
      value: date('completeDate'),
    }}
    language={{
      value: {
        name: { value: text('name', 'English') },
        rodNumber: { value: text('rodNumber', '01234') },
        organizationPopulation: { value: number('population', 10000) },
        ethnologuePopulation: { value: 0 },
        avatarLetters: 'E',
        displayName: {},
      },
    }}
    products={{ total: 1, items: [{ type: 'NewTestamentFull' }] }}
  />
);
