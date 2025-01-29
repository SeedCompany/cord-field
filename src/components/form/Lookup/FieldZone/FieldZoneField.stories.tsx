import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { Form } from 'react-final-form';
import { ChildrenProp } from '~/common';
import { FieldSpy } from '../../FieldSpy';
import {
  FieldRegionField,
  FieldZoneField,
  LocationField,
} from './FieldZoneField';

export default { title: 'Components/Forms/Fields/Lookup/Location' };

const FF = ({ children }: ChildrenProp) => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      location: {
        id: 'locationId',
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

export const FieldRegion = () => (
  <FF>
    <FieldRegionField
      name="fieldRegion"
      label="Field Regions"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="fieldRegion" />
  </FF>
);

export const FieldZone = () => (
  <FF>
    <FieldZoneField
      name="fieldZone"
      label="Field Zones"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="fieldZone" />
  </FF>
);
