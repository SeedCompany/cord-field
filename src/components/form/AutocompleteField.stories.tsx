import { Box } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { csv } from '../../util';
import { AutocompleteField } from './AutocompleteField';
import { FieldSpy } from './FieldSpy';

export default { title: 'Components/Forms/Fields' };

export const Autocomplete = () => {
  return (
    <Form
      onSubmit={action('onSubmit')}
      initialValues={{
        color: text('initialValue', 'blue'),
      }}
    >
      {({ handleSubmit }) => (
        <>
          <FieldSpy name="color" />
          <Box component="form" onSubmit={handleSubmit} mt={4}>
            <AutocompleteField
              fullWidth={boolean('fullWidth', false)}
              name="color"
              label={text('label', 'Color')}
              helperText="Choose a color"
              defaultValue={text('defaultValue', '')}
              disabled={boolean('disabled', false)}
              options={csv(
                text('options (csv)', 'red, blue, green, yellow, teal')
              )}
            />
          </Box>
        </>
      )}
    </Form>
  );
};
