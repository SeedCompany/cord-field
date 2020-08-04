import { Box } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import React, { FC } from 'react';
import { Form } from 'react-final-form';
import { FieldSpy } from '../../FieldSpy';
import { OrganizationField as OA } from './OrganizationField';

export default { title: 'Components/Forms/Fields/Lookup/Organization' };

const FF: FC = ({ children }) => (
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
    <Box mt={50}>
      <FieldSpy name="organization" />
    </Box>
  </FF>
);

export const Multiple = () => (
  <FF>
    <OA name="organizations" multiple label="Orgs" />
    <FieldSpy name="organizations" />
  </FF>
);
