import { number, text } from '@storybook/addon-knobs';
import { EngagementStatus } from '../../api';
import { LanguageEngagementListItemCard as Card } from './LanguageEngagementListItemCard';

export default { title: 'Components' };

export const LanguageEngagementListItemCard = () => (
  <Card
    __typename="LanguageEngagement"
    id="123123"
    status={{
      value: text('status', 'InDevelopment') as EngagementStatus,
      canRead: true,
    }}
    language={{
      value: {
        id: '123',
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
        sensitivity: 'High',
      },
    }}
    project={{
      __typename: 'TranslationProject',
      id: 'abc',
    }}
    products={{ total: 2 }}
  />
);
