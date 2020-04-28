import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { PasswordField as PF } from './PasswordField';

export default { title: 'Components/PasswordField' };

export const PasswordField = () => (
  <Form onSubmit={action('onSubmit')}>
    {(props) => (
      <PF
        {...props}
        label={text('Label', 'Password')}
        variant={select(
          'Variant',
          ['standard', 'outlined', 'filled'],
          'filled'
        )}
        required={boolean('Required', true)}
        disabled={boolean('Disabled', false)}
        fullWidth={boolean('Full Width', true)}
        onClick={action('click')}
      />
    )}
  </Form>
);
