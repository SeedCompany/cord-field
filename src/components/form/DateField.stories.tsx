import LuxonUtils from '@date-io/luxon';
import { LocalizationProvider } from '@material-ui/pickers';
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { DateField as DF } from './DateField';

export default { title: 'Components/DateField' };

export const DateField = () => (
  <LocalizationProvider dateAdapter={LuxonUtils}>
    <Form onSubmit={action('onSubmit')}>
      {() => (
        <DF
          name="name"
          disabled={boolean('Disabled', false)}
          fullWidth={boolean('Full Width', false)}
          variant={select(
            'Variant',
            ['standard', 'outlined', 'filled'],
            'standard'
          )}
          helperText={text('HelperText', 'DatePicker')}
          initialValue={new Date().toISOString().slice(0, 10)}
          onClick={action('click')}
          onYearChange={action('changeYear')}
        />
      )}
    </Form>
  </LocalizationProvider>
);
