import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { EmailField as EF } from './EmailField';

export default { title: 'Components/Forms/Fields' };

export const Email = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <EF
          name="email"
          label={text('Label', 'Email')}
          placeholder={text('placeholder', 'Enter Email Address')}
          required={boolean('Required', true)}
          fullWidth={boolean('Full Width', true)}
          disabled={boolean('Disabled', false)}
          onClick={action('click')}
        />
      </form>
    )}
  </Form>
);
