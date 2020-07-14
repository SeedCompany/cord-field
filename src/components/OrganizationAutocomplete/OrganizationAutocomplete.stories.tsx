import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { SubmitButton } from '../form';
import { FieldSpy } from '../form/FieldSpy';
import { OrganizationAutocomplete as OA } from './OrganizationAutocomplete';

export default { title: 'Components/Organization Autocomplete' };

export const OrganizationAutocomplete = () => {
  return (
    <Form onSubmit={action('onSubmit')}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <OA
            TextFieldProps={{
              label: text('Label', 'Organizations'),
              helperText: text('Helper Text', 'Search for Organizations'),
              required: boolean('Required', false),
            }}
            disableClearable={boolean('Disable Clearable', false)}
            multiple={boolean('Multiple', false)}
            // don't think we want to support adding new options that don't appear (via freeSolo) here
            // at least not until we decide to support creating new orgs directly from the Autocomplete
            noOptionsText={text('No Options Text', 'No matches')}
            disabled={boolean('Disabled', false)}
          />
          <SubmitButton />
          <FieldSpy name="autocomplete" />
        </form>
      )}
    </Form>
  );
};
