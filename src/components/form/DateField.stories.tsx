import { action } from '@storybook/addon-actions';
import { boolean, text } from '@storybook/addon-knobs';
import React from 'react';
import { Form } from 'react-final-form';
import { CalendarDate } from '../../util';
import { DateField as DF } from './DateField';

export default { title: 'Components/Forms/Fields' };

export const Date = () => (
  <Form onSubmit={action('onSubmit')}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <DF
          name="startDate"
          label={text('Label', 'Start Date')}
          placeholder={text('placeholder', 'Enter Start Date')}
          disabled={boolean('Disabled', false)}
          fullWidth={boolean('Full Width', true)}
          helperText={text('HelperText', 'DatePicker')}
          initialValue={CalendarDate.local().toString()}
          onYearChange={action('changeYear')}
          onClick={action('click')}
        />
      </form>
    )}
  </Form>
);
