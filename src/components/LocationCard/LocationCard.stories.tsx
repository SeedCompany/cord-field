import { boolean, select, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { LocationTypeList } from '../../api';
import { LocationCard as Card } from './LocationCard';
import { LocationCardFragment } from './LocationCard.generated';

export default { title: 'Components' };

export const LocationCard = () => {
  const loading = boolean('Loading', false);
  const locationObj: LocationCardFragment = {
    id: '123123',
    name: {
      canEdit: true,
      canRead: true,
      value: text('Location Name', 'United States'),
    },
    locationType: {
      canRead: true,
      value: select('Type', LocationTypeList, LocationTypeList[0]),
    },
    createdAt: DateTime.local(),
  };

  return (
    <Card loading={loading} location={loading ? undefined : locationObj} />
  );
};
