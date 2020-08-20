import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React, { FC } from 'react';
import { Form } from 'react-final-form';
import { FieldSpy } from '../../FieldSpy';
import { LiteracyMaterialField } from './LiteracyMaterialField';

export default { title: 'Components/Forms/Fields/Lookup' };

const FF: FC = ({ children }) => (
  <Form onSubmit={action('submit')}>
    {({ handleSubmit }) => <form onSubmit={handleSubmit}>{children}</form>}
  </Form>
);

export const LiteracyMaterial = () => (
  <FF>
    <LiteracyMaterialField
      name="literacyMaterial"
      label="Literacy Material"
      multiple={boolean('Multiple', false)}
    />
    <FieldSpy name="literacyMaterial" />
  </FF>
);
