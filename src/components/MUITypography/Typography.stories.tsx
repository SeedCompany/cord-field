import { Typography, TypographyVariant } from '@material-ui/core';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';

export default { title: 'Components/Typography' };

const VariantOptions: TypographyVariant[] = [
  'body1',
  'body2',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'caption',
  'subtitle1',
  'subtitle2',
];

export const Story = () => (
  <div>
    <Typography
      variant={select('Variant', VariantOptions, 'body1')}
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
      display={select('Display', ['initial', 'inline', 'block'], 'initial')}
      gutterBottom={boolean('gutterBottom', true)}
      noWrap={boolean('Wrap', true)}
    >
      {text('Children', 'Children')}
    </Typography>
    <Typography variant="h1">h1. Heading</Typography>
  </div>
);
