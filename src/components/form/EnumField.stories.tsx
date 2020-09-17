import { Box } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import { startCase } from 'lodash';
import React from 'react';
import { Form } from 'react-final-form';
import { csv } from '../../util';
import { EnumField, EnumOption } from './EnumField';
import { FieldSpy } from './FieldSpy';

export default { title: 'Components/Forms/Fields/Enum' };

export const Checkboxes = () => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      colors: csv(text('initialValue (csv)', 'blue, teal')),
    }}
  >
    {({ handleSubmit }) => (
      <>
        <Box component="form" onSubmit={handleSubmit} mb={4}>
          <EnumField
            // fullWidth={boolean('fullWidth', false)}
            // row={boolean('row', false)}
            name="colors"
            multiple={true}
            variant="checkbox"
            label={text('label', 'Colors')}
            helperText="Choose some colors"
            // defaultValue={csv(text('defaultValue (csv)', ''))}
            disabled={boolean('disabled', false)}
            required={boolean('required', false)}
          >
            <EnumOption default label="All Colors" />
            {['red', 'blue', 'green', 'yellow'].map((color) => (
              <EnumOption key={color} label={startCase(color)} value={color} />
            ))}
            <EnumOption disabled value="teal" label="Teal" />
          </EnumField>
        </Box>
        <FieldSpy name="colors" />
      </>
    )}
  </Form>
);

export const CheckboxSingle = () => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      color: text('initialValue', 'blue'),
    }}
  >
    {({ handleSubmit }) => (
      <>
        <Box component="form" onSubmit={handleSubmit} mb={4}>
          <EnumField
            // fullWidth={boolean('fullWidth', false)}
            // row={boolean('row', false)}
            name="color"
            multiple={false}
            variant="checkbox"
            label={text('label', 'Color')}
            helperText="Choose a color"
            defaultValue={text('defaultValue', '') || undefined}
            disabled={boolean('disabled', false)}
            required={boolean('required', false)}
          >
            <EnumOption default label="No Color" />
            {['red', 'blue', 'green', 'yellow'].map((color) => (
              <EnumOption key={color} label={startCase(color)} value={color} />
            ))}
            <EnumOption disabled value="teal" label="Teal" />
          </EnumField>
        </Box>
        <FieldSpy name="color" />
      </>
    )}
  </Form>
);
