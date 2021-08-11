import { boolean, select } from '@storybook/addon-knobs';
import React from 'react';
import { PresetInventoryFlag as PresetInventoryFlagComponent } from './PresetInventoryFlag';

export default { title: 'Components' };

export const PresetInventory = () => (
  <PresetInventoryFlagComponent
    value={select('value', ['PresetInventory'], 'PresetInventory')}
    loading={boolean('loading', false)}
  />
);
