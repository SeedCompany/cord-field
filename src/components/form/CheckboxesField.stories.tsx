import { Box } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import { startCase } from 'lodash';
import React from 'react';
import { Form } from 'react-final-form';
import { csv } from '../../util';
import {
  CheckboxesField,
  CheckboxOption,
  ToggleButtonOption,
} from './CheckboxesField';
import { FieldSpy } from './FieldSpy';

export default { title: 'Components/Forms/Fields' };

export const Checkboxes = () => {
  return (
    <Form
      onSubmit={action('onSubmit')}
      initialValues={{
        colors: csv(text('initialValue (csv)', 'blue, teal')),
      }}
    >
      {({ handleSubmit }) => (
        <>
          <Box component="form" onSubmit={handleSubmit} mb={4}>
            <CheckboxesField
              fullWidth={boolean('fullWidth', false)}
              row={boolean('row', false)}
              name="colors"
              label={text('label', 'Colors')}
              validate={(val) =>
                val.length > 0 && val.length < 3 ? 'Select three' : undefined
              }
              helperText="Choose some colors"
              defaultValue={csv(text('defaultValue (csv)', ''))}
              disabled={boolean('disabled', false)}
              labelPlacement={select(
                'labelPlacement',
                ['start', 'end', 'top', 'bottom'],
                'end'
              )}
            >
              <CheckboxOption default label="All Colors" />
              {['red', 'blue', 'green', 'yellow'].map((color) => (
                <CheckboxOption
                  key={color}
                  label={startCase(color)}
                  value={color}
                />
              ))}
              <CheckboxOption disabled value="teal" label="Teal" />
            </CheckboxesField>
          </Box>
          <FieldSpy name="colors" />
        </>
      )}
    </Form>
  );
};

export const ToggleButtons = () => {
  return (
    <Form
      onSubmit={action('onSubmit')}
      initialValues={{
        colors: csv(text('initialValue (csv)', 'blue, teal')),
      }}
    >
      {({ handleSubmit }) => (
        <>
          <Box component="form" onSubmit={handleSubmit} mb={4}>
            <CheckboxesField
              fullWidth={boolean('fullWidth', false)}
              row={boolean('row', true)}
              name="colors"
              label={text('label', 'Colors')}
              validate={(val) =>
                val.length > 0 && val.length < 3 ? 'Select three' : undefined
              }
              helperText="Choose some colors"
              defaultValue={csv(text('defaultValue (csv)', ''))}
              disabled={boolean('disabled', false)}
              labelPlacement={select(
                'labelPlacement',
                ['start', 'end', 'top', 'bottom'],
                'end'
              )}
            >
              {['red', 'blue', 'green', 'yellow'].map((color) => (
                <ToggleButtonOption
                  key={color}
                  label={startCase(color)}
                  value={color}
                />
              ))}
              <ToggleButtonOption disabled value="teal" label="Teal" />
            </CheckboxesField>
          </Box>
          <FieldSpy name="colors" />
        </>
      )}
    </Form>
  );
};
