import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { SubmitButton as SB } from './SubmitButton';

export default { title: 'Components/Forms' };

export const SubmitButton = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <SB
          name="submit"
          spinner={boolean('Progress', true)}
          size={select('Size', ['small', 'medium', 'large'], 'large')}
          fullWidth={boolean('Full Width', true)}
          color={select(
            'Color',
            ['inherit', 'primary', 'secondary', 'default', 'error'],
            'secondary'
          )}
          onClick={action('click')}
        >
          {text('Label', 'SubmitButton')}
        </SB>
      </form>
    )}
  </Form>
);
