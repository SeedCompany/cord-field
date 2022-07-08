import { action } from '@storybook/addon-actions';
import React from 'react';
import { Form } from 'react-final-form';
import { ChildrenProp } from '~/util';
import { FieldSpy } from '../../FieldSpy';
import { OrganizationField as OA } from './OrganizationField';

export default { title: 'Components/Forms/Fields/Lookup/Organization' };

const FF = ({ children }: ChildrenProp) => (
  <Form
    onSubmit={action('submit')}
    initialValues={{
      organization: {
        id: 'seedcompanyid',
        name: {
          value: 'Seed Company',
        },
      },
      organizations: [
        {
          id: 'seedcompanyid',
          name: {
            value: 'Seed Company',
          },
        },
      ],
    }}
  >
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const Single = () => (
  <FF>
    <OA name="organization" label="Org" required />
    <FieldSpy name="organization" />
  </FF>
);

export const Multiple = () => (
  <FF>
    <OA name="organizations" multiple label="Orgs" />
    <FieldSpy name="organizations" />
  </FF>
);
