import { number, text } from '@storybook/addon-knobs';
import React from 'react';
import { EngagementStatus } from '../../api';
import { date } from '../knobs.stories';
import { LanguageEngagementListItemCard as Card } from './LanguageEngagementListItemCard';

export default { title: 'Components' };

export const LanguageEngagementListItemCard = () => (
  <Card
    id="123123"
    projectId="123123"
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
        registryOfDialectsCode: {
          value: text('Registry Of Dialects Code', '01234'),
        },
        ethnologue: {
          code: {
            canRead: true,
            canEdit: true,
            value: text('Ethnologue Code', 'abc'),
          },
        },
        population: { value: number('population', 10000) },
        avatarLetters: 'E',
        displayName: {},
      },
    }}
    products={{ total: 1, items: [{ id: '1234' }] }}
  />
);
