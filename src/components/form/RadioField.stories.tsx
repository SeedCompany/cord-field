import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { startCase } from 'lodash';
import React from 'react';
import { Form } from 'react-final-form';
import { RadioField, RadioOption } from './RadioField';

export default {
  title: 'Components/Forms/Fields',
};

export const Radio = () => {
  const labelPlacement = select(
    'Label Placement',
    ['start', 'end', 'top', 'bottom'],
    'end'
  );
  const disabled = boolean('Disabled', false);

  return (
    <Form onSubmit={action('onSubmit')}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <RadioField
            name="color"
            label={text('Label', 'Color')}
            disabled={disabled}
            color={select('Color', ['primary', 'secondary'], 'secondary')}
            helperText={text('Helper Text', 'Choose carefully')}
          >
            {['red', 'blue', 'green'].map((color) => (
              <RadioOption
                label={startCase(color)}
                value={color}
                disabled={disabled}
                labelPlacement={labelPlacement}
              />
            ))}
          </RadioField>
        </form>
      )}
    </Form>
  );
};
