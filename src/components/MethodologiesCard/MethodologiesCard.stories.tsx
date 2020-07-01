import { Box } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';
import { MethodologiesCard as Card } from './MethodologiesCard';

export default {
  title: 'Components',
};

export const MethodologiesCard = () => (
  <Box display="flex" width={400}>
    <Card
      onEdit={action('Edit Clicked')}
      methodologies={{
        canEdit: boolean('Can Edit', true),
        //TODO: knob for adding in values
        value: [
          'OtherWritten',
          'OtherOralTranslation',
          'Film',
          'BibleStorying',
          'OtherOralTranslation',
        ],
        canRead: true,
      }}
    />
  </Box>
);
