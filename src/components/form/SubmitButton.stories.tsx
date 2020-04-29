import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { SubmitButton as SB } from './SubmitButton';

export default { title: 'Components/SubmitButton' };

export const SubmitButton = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <SB
          spinner={boolean('Full Width', false)}
          size={select('Size', ['small', 'medium', 'large'], 'medium')}
          variant={select(
            'Variant',
            ['contained', 'text', 'outlined'],
            'contained'
          )}
          fullWidth={boolean('Full Width', false)}
          color={select(
            'Color',
            ['inherit', 'primary', 'secondary', 'default', 'error'],
            'primary'
          )}
          onClick={action('click')}
        >
          {text('Label', 'SubmitButton')}
        </SB>
      </form>
    )}
  </Form>
);
