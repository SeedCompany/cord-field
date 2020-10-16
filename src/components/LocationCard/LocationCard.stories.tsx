import { boolean, select, text } from '@storybook/addon-knobs';
import { DateTime } from 'luxon';
import React from 'react';
import { LocationCard as Card } from './LocationCard';

export default { title: 'Components' };

export const LocationCard = () => {
  const loading = boolean('Loading', false);
  const locationObj = {
    id: '123123',
    name: {
      canEdit: true,
      canRead: true,
      value: text('Location Name', 'United States'),
    },
    sensitivity: select('Sensitivity', ['High', 'Medium', 'Low'], 'High'),
    type: {
      canEdit: true,
      canRead: true,
      value: select(
        'Type',
        ['City', 'County', 'State', 'County', 'CrossBorderArea'],
        'City'
      ),
    },
    createdAt: DateTime.local(),
  };

  const cardProps = {
    loading,
    location: loading ? undefined : locationObj,
  };

  return <Card {...cardProps} />;
};
