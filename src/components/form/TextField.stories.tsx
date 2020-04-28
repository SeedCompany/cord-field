import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { TextField as TF } from './TextField';

export default { title: 'Components/TextField' };

export const TextField = () => (
  <Form onSubmit={action('onSubmit')}>
    {(props) => (
      <TF
        {...props}
        name="TextField"
        label={text('Label', 'TextField')}
        required={boolean('Required', true)}
        disabled={boolean('Disabled', false)}
        fullWidth={boolean('Full Width', true)}
        helperText={text('Helper Text', 'TextField')}
      />
    )}
  </Form>
);
