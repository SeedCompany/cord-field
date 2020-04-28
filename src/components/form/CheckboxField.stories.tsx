import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { CheckboxField as CB } from './CheckboxField';

export default { title: 'Components/CheckboxField' };

export const CheckboxField = () => (
  <Form onSubmit={action('onSubmit')}>
    {() => (
      <CB
        name="checkbox"
        label={text('Label', 'CheckboxField')}
        labelPlacement={select(
          'LabelPlacement',
          ['start', 'end', 'top', 'bottom'],
          'end'
        )}
        defaultValue={boolean('DefaultValue', false)}
        disabled={boolean('Disabled', false)}
        color={select('Color', ['primary', 'secondary', 'default'], 'primary')}
        onClick={action('click')}
      />
    )}
  </Form>
);
