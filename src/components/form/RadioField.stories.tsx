import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { RadioField, RadioOption } from './RadioField';

export default {
  title: 'Components/Forms/Fields',
};

export const Radio = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <RadioField
          name="radio"
          label={text('Label', 'Radio')}
          disabled={boolean('Disabled', false)}
          color={select('Color', ['primary', 'secondary'], 'secondary')}
        >
          <RadioOption
            label={text('Option Label', 'Radio Option')}
            value=""
            disabled={boolean('Disabled', false)}
            labelPlacement={select(
              'Label Placement',
              ['start', 'end', 'top', 'bottom'],
              'end'
            )}
          />
        </RadioField>
      </form>
    )}
  </Form>
);
