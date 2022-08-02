import { boolean, number, select, text } from '@storybook/addon-knobs';
import { LanguageListItemFragment } from './LanguageListItem.graphql';
import { LanguageListItemCard } from './LanguageListItemCard';

export default { title: 'Components/Language List Item Card' };

export const WithData = () => {
  const language: LanguageListItemFragment = {
    id: '123',
    name: {
      value: text('name', 'English'),
    },
    displayName: {
      value: text('display name', 'German'),
    },
    ethnologue: {
      code: { value: text('Ethnologue Code', 'cnk') },
    },
    registryOfDialectsCode: {
      value: text('Registry Of Dialects Code', '05182'),
    },
    population: {
      value: number('Population', 10000),
    },
    sensitivity: select('Sensitivity', ['High', 'Medium', 'Low'], 'High'),
    presetInventory: {
      value: boolean('Preset Inventory', true),
    },
    pinned: false,
  };

  return <LanguageListItemCard language={language} />;
};

export const Loading = () => <LanguageListItemCard />;
