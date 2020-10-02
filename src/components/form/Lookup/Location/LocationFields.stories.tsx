import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React, { FC } from 'react';
import { Form } from 'react-final-form';
import { FieldSpy } from '../../FieldSpy';
import { LocationField } from './LocationFields';

export default { title: 'Components/Forms/Fields/Lookup/Location' };

const FF: FC = ({ children }) => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      location: {
        id: 'locationId',
        name: {
          value: 'Ethiopia',
        },
      },
    }}
  >
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const Location = () => (
  <FF>
    <LocationField
      name="location"
      label="Location"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="location" />
  </FF>
);
