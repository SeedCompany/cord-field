import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React, { FC } from 'react';
import { Form } from 'react-final-form';
import { FieldSpy } from '../../FieldSpy';
import { CountryField, RegionField, ZoneField } from './LocationFields';

export default { title: 'Components/Forms/Fields/Lookup/Location' };

const FF: FC = ({ children }) => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      country: {
        id: 'countryid',
        name: {
          value: 'Ethiopia',
        },
      },
      region: {
        id: 'regionid',
        name: {
          value: 'Africa - Anglophone East',
        },
      },
      zone: {
        id: 'zoneid',
        name: {
          value: 'Africa',
        },
      },
    }}
  >
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const Country = () => (
  <FF>
    <CountryField
      name="country"
      label="Countries"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="country" />
  </FF>
);

export const Region = () => (
  <FF>
    <RegionField
      name="region"
      label="Regions"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="region" />
  </FF>
);

export const Zone = () => (
  <FF>
    <ZoneField
      name="zone"
      label="Zones"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="zone" />
  </FF>
);
