import { boolean, text } from '@storybook/addon-knobs';
import * as React from 'react';
import { OrganizationListItemFragment } from './OrganizationListItem.generated';
import { OrganizationListItemCard as OLIC } from './OrganizationListItemCard';

export default { title: 'Components' };

export const OrganizationListItemCard = () => {
  const organization: OrganizationListItemFragment = {
    id: '123456',
    name: {
      value: text('Name', 'Seed Company'),
    },
  };
  return (
    <OLIC organization={boolean('loading', false) ? undefined : organization} />
  );
};
