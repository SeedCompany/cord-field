import { boolean, text } from '@storybook/addon-knobs';
import * as React from 'react';
import { OrganizationListItemCard as OLIC } from './OrganizationItemCard';
import { OrganizationListItemFragment } from './OrganizationListItem.generated';

export default { title: 'components' };

export const OrganiztionListItemCard = () => {
  const organization: OrganizationListItemFragment = {
    id: '123456',
    name: {
      value: text('OrganizationName', 'Seed Company'),
    },
  };
  return (
    <OLIC organization={boolean('loading', false) ? undefined : organization} />
  );
};
