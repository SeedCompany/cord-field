import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { startCase } from 'lodash';
import React from 'react';
import { Form } from 'react-final-form';
import { FieldSpy } from './FieldSpy';
import { RadioField, RadioOption } from './RadioField';
import { SubmitButton } from './SubmitButton';

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
  const initialValue = text('initialValue', '');

  return (
    <Form
      onSubmit={action('submit')}
      initialValues={{ color: initialValue || undefined }}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <RadioField
            name="color"
            label={text('Label', 'Color')}
            disabled={disabled}
            helperText={text('Helper Text', 'Choose carefully')}
            labelPlacement={labelPlacement}
          >
            {['red', 'blue', 'green'].map((color) => (
              <RadioOption key={color} label={startCase(color)} value={color} />
            ))}
          </RadioField>
          <FieldSpy name="color" />
          <SubmitButton />
        </form>
      )}
    </Form>
  );
};
