import { Typography } from '@material-ui/core';
import { select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Components/Typography' };

export const Story = () => (
  <Typography
    variant={select(
      'Variant',
      ['body1', 'body2', 'h1', 'h2', 'h3', 'h4', 'caption'],
      'body1'
    )}
    color={select(
      'Color',
      [
        'inherit',
        'initial',
        'primary',
        'secondary',
        'textPrimary',
        'textSecondary',
        'error',
      ],
      'initial'
    )}
    align={select(
      'Align',
      ['left', 'right', 'center', 'justify', 'inherit'],
      'left'
    )}
  >
    {text('Children', 'Children')}
  </Typography>
);
