import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { EmailField as EF } from './EmailField';

export default { title: 'Components/EmailField' };

export const EmailField = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <EF
          label={text('Label', 'Email')}
          required={boolean('Required', true)}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
          variant={select(
            'Variant',
            ['standard', 'outlined', 'filled'],
            'filled'
          )}
          onClick={action('click')}
        />
      </form>
    )}
  </Form>
);
