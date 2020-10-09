import { number, text } from '@storybook/addon-knobs';
import React from 'react';
import { EngagementStatus } from '../../api';
import { LanguageEngagementListItemCard as Card } from './LanguageEngagementListItemCard';

export default { title: 'Components' };

export const LanguageEngagementListItemCard = () => (
  <Card
    id="123123"
    projectId="123123"
    status={text('status', 'InDevelopment') as EngagementStatus}
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
    products={{ total: 2 }}
  />
);
